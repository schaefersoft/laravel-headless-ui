type Root = Document | HTMLElement;

const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusable(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
}

function trapFocus(el: HTMLElement, e: KeyboardEvent) {
    if (e.key !== 'Tab') return;
    const focusable = getFocusable(el);
    if (focusable.length === 0) { e.preventDefault(); return; }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
}

// --- Transition helpers ---

function getTransitionClasses(el: HTMLElement, prefix: string) {
    const base = (el.getAttribute(prefix) || '').split(/\s+/).filter(Boolean);
    const from = (el.getAttribute(`${prefix}-from`) || '').split(/\s+/).filter(Boolean);
    const to = (el.getAttribute(`${prefix}-to`) || '').split(/\s+/).filter(Boolean);
    return { base, from, to };
}

function hasTransition(el: HTMLElement, prefix: string): boolean {
    return el.hasAttribute(prefix) || el.hasAttribute(`${prefix}-from`) || el.hasAttribute(`${prefix}-to`);
}

function nextFrame(): Promise<void> {
    return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
}

function afterTransition(el: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
        const styles = getComputedStyle(el);
        const dur = parseFloat(styles.transitionDuration || '0');
        const del = parseFloat(styles.transitionDelay || '0');
        const total = (dur + del) * 1000;
        if (total <= 0) { resolve(); return; }
        let done = false;
        const finish = () => { if (done) return; done = true; el.removeEventListener('transitionend', finish); resolve(); };
        el.addEventListener('transitionend', finish, { once: true });
        setTimeout(finish, total + 50);
    });
}

function prepareEnterTransition(el: HTMLElement, prefix: string): void {
    const { base, from } = getTransitionClasses(el, prefix);
    if (base.length > 0 || from.length > 0) {
        el.classList.add(...base, ...from);
    }
}

function startEnterTransition(el: HTMLElement, prefix: string): Promise<void> {
    const { base, from, to } = getTransitionClasses(el, prefix);
    if (base.length === 0 && from.length === 0 && to.length === 0) return Promise.resolve();
    // base + from were already applied by prepareEnterTransition
    return nextFrame().then(() => {
        el.classList.remove(...from);
        el.classList.add(...to);
        return afterTransition(el);
    }).then(() => {
        el.classList.remove(...base, ...to);
    });
}

function runLeaveTransition(el: HTMLElement, prefix: string): Promise<void> {
    const { base, from, to } = getTransitionClasses(el, prefix);
    if (base.length === 0 && from.length === 0 && to.length === 0) return Promise.resolve();
    el.classList.add(...base, ...from);
    return nextFrame().then(() => {
        el.classList.remove(...from);
        el.classList.add(...to);
        return afterTransition(el);
    });
    // Do NOT remove classes — element will be hidden by dialog.close()
}

function cleanupLeaveTransition(el: HTMLElement, prefix: string): void {
    const { base, to } = getTransitionClasses(el, prefix);
    el.classList.remove(...base, ...to);
}

function getTransitionTargets(dialog: HTMLElement): HTMLElement[] {
    const targets: HTMLElement[] = [];
    if (hasTransition(dialog, 'data-hui-flyout-enter') || hasTransition(dialog, 'data-hui-flyout-leave')) {
        targets.push(dialog);
    }
    targets.push(...Array.from(dialog.querySelectorAll<HTMLElement>(
        '[data-hui-flyout-enter], [data-hui-flyout-leave]'
    )));
    return targets;
}

// --- Responsive mode ---

function getBreakpoint(flyout: HTMLDialogElement): number | null {
    const bp = flyout.getAttribute('data-hui-flyout-inline');
    if (!bp) return null;
    const val = parseInt(bp, 10);
    return Number.isFinite(val) && val > 0 ? val : null;
}

function isInlineMode(flyout: HTMLDialogElement): boolean {
    const bp = getBreakpoint(flyout);
    if (bp === null) return false;
    return window.innerWidth >= bp;
}

// --- Swipe gestures ---

type FlyoutPosition = 'left' | 'right' | 'top' | 'bottom';
type SwipeMode = 'open' | 'close' | 'both';

const SWIPE_AXIS: Record<FlyoutPosition, 'x' | 'y'> = {
    left: 'x', right: 'x', top: 'y', bottom: 'y',
};

// Direction the panel exits in: right/bottom = positive, left/top = negative.
const SWIPE_CLOSE_SIGN: Record<FlyoutPosition, 1 | -1> = {
    left: -1, right: 1, top: -1, bottom: 1,
};

function getFlyoutPosition(flyout: HTMLElement): FlyoutPosition {
    const p = flyout.getAttribute('data-hui-flyout-position');
    return (p === 'left' || p === 'top' || p === 'bottom') ? p : 'right';
}

function getSwipeMode(flyout: HTMLElement): SwipeMode | null {
    const v = flyout.getAttribute('data-hui-flyout-swipe');
    return (v === 'open' || v === 'close' || v === 'both') ? v : null;
}

function atCloseScrollBoundary(panel: HTMLElement, position: FlyoutPosition): boolean {
    if (position === 'left' || position === 'right') return true;
    if (position === 'bottom') return panel.scrollTop <= 0;
    return panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1;
}

function projectOpenSwipe(position: FlyoutPosition, dx: number, dy: number): { inward: number; cross: number } {
    switch (position) {
        case 'left': return { inward: dx, cross: dy };
        case 'right': return { inward: -dx, cross: dy };
        case 'top': return { inward: dy, cross: dx };
        case 'bottom': return { inward: -dy, cross: dx };
    }
}

function inOpenEdgeZone(x: number, y: number, position: FlyoutPosition, edge: number): boolean {
    switch (position) {
        case 'left': return x <= edge;
        case 'right': return x >= window.innerWidth - edge;
        case 'top': return y <= edge;
        case 'bottom': return y >= window.innerHeight - edge;
    }
}

// --- Flyout setup ---

function setupFlyout(flyout: HTMLDialogElement) {
    if (flyout.hasAttribute('data-hui-flyout-initialized')) return;
    flyout.setAttribute('data-hui-flyout-initialized', '');

    let previouslyFocused: HTMLElement | null = null;
    let isTransitioning = false;

    const noEscape = flyout.hasAttribute('data-hui-flyout-no-escape');
    const noBackdropClose = flyout.hasAttribute('data-hui-flyout-no-backdrop-close');
    const scrollLock = flyout.hasAttribute('data-hui-flyout-scroll-lock');

    function updateInlineState() {
        const bp = getBreakpoint(flyout);
        if (bp === null) return;

        if (isInlineMode(flyout)) {
            flyout.setAttribute('data-hui-flyout-mode', 'inline');
            // If open as modal, close it — inline mode shows it statically
            if (flyout.open && flyout.hasAttribute('data-hui-flyout-open')) {
                flyout.close();
            }
            flyout.removeAttribute('data-hui-flyout-open');
        } else {
            flyout.setAttribute('data-hui-flyout-mode', 'flyout');
        }
    }

    function open() {
        if (isInlineMode(flyout)) return; // In inline mode, always visible
        if (flyout.open || isTransitioning) return;

        previouslyFocused = document.activeElement as HTMLElement | null;

        // Apply enter-from classes BEFORE showModal to prevent flicker
        const targets = getTransitionTargets(flyout);
        const enterTargets = targets.filter((t) => hasTransition(t, 'data-hui-flyout-enter'));
        enterTargets.forEach((t) => prepareEnterTransition(t, 'data-hui-flyout-enter'));

        flyout.showModal();
        flyout.setAttribute('data-hui-flyout-open', '');

        if (scrollLock) {
            document.body.style.overflow = 'hidden';
        }

        const focusable = getFocusable(flyout);
        if (focusable.length > 0) {
            focusable[0].focus();
        }

        // Run the enter transitions (from → to)
        if (enterTargets.length > 0) {
            Promise.all(enterTargets.map((t) => startEnterTransition(t, 'data-hui-flyout-enter')));
        }

        flyout.dispatchEvent(new CustomEvent('hui:flyout:open', { bubbles: true }));
    }

    function close(opts: { immediate?: boolean } = {}) {
        if (isInlineMode(flyout)) return;
        if (!flyout.open || isTransitioning) return;

        const targets = getTransitionTargets(flyout);
        const leaveTargets = opts.immediate
            ? []
            : targets.filter((t) => hasTransition(t, 'data-hui-flyout-leave'));

        function finishClose() {
            flyout.close();
            flyout.removeAttribute('data-hui-flyout-open');

            if (scrollLock) {
                const otherLocked = document.querySelector<HTMLDialogElement>(
                    'dialog[data-hui-flyout][data-hui-flyout-scroll-lock][open]'
                );
                if (!otherLocked) {
                    document.body.style.overflow = '';
                }
            }

            if (previouslyFocused && previouslyFocused.focus) {
                previouslyFocused.focus();
            }
            previouslyFocused = null;
            isTransitioning = false;

            flyout.dispatchEvent(new CustomEvent('hui:flyout:close', { bubbles: true }));
        }

        if (leaveTargets.length > 0) {
            isTransitioning = true;
            const transitions = leaveTargets.map((t) => runLeaveTransition(t, 'data-hui-flyout-leave'));
            Promise.all(transitions).then(() => {
                finishClose();
                leaveTargets.forEach((t) => cleanupLeaveTransition(t, 'data-hui-flyout-leave'));
            });
        } else {
            finishClose();
        }
    }

    // Focus trap
    flyout.addEventListener('keydown', (e: KeyboardEvent) => {
        trapFocus(flyout, e);
    });

    // Cancel (Escape)
    flyout.addEventListener('cancel', (e) => {
        e.preventDefault();
        if (!noEscape) close();
    });

    // Backdrop / background click
    flyout.addEventListener('click', (e) => {
        if (noBackdropClose) return;
        const target = e.target as HTMLElement;
        if (target === flyout || target.hasAttribute('data-hui-flyout-background')) close();
    });

    // Close buttons
    flyout.addEventListener('click', (e) => {
        const target = (e.target as HTMLElement).closest<HTMLElement>('[data-hui-flyout-close]');
        if (target) close();
    });

    // ARIA
    const title = flyout.querySelector<HTMLElement>('[data-hui-flyout-title]');
    const description = flyout.querySelector<HTMLElement>('[data-hui-flyout-description]');
    if (title) {
        if (!title.id) title.id = `hui-flyout-title-${uniqueId()}`;
        flyout.setAttribute('aria-labelledby', title.id);
    }
    if (description) {
        if (!description.id) description.id = `hui-flyout-desc-${uniqueId()}`;
        flyout.setAttribute('aria-describedby', description.id);
    }

    // Responsive: listen for resize
    const bp = getBreakpoint(flyout);
    if (bp !== null) {
        const mq = window.matchMedia(`(min-width: ${bp}px)`);
        mq.addEventListener('change', updateInlineState);
        updateInlineState();
    }

    // Swipe gestures
    function setupSwipeClose(position: FlyoutPosition) {
        const axis = SWIPE_AXIS[position];
        const sign = SWIPE_CLOSE_SIGN[position];
        const panels = Array.from(flyout.querySelectorAll<HTMLElement>('[data-hui-flyout-panel]'));

        panels.forEach((panel) => {
            let startX = 0, startY = 0, lastTime = 0;
            let progress = 0;
            let velocity = 0;
            let size = 0;
            let decided = false;
            let active = false;

            function reset() {
                decided = false; active = false; progress = 0; velocity = 0;
            }

            function settle(transform: string, then?: () => void) {
                panel.style.transition = 'transform 0.2s cubic-bezier(0.3, 0, 0.2, 1)';
                panel.style.transform = transform;
                afterTransition(panel).then(() => {
                    if (then) then();
                    panel.style.transition = '';
                    panel.style.transform = '';
                });
            }

            panel.addEventListener('touchstart', (e: TouchEvent) => {
                if (e.touches.length !== 1) return;
                if (!flyout.open || isInlineMode(flyout) || isTransitioning) return;
                const t = e.touches[0];
                startX = t.clientX; startY = t.clientY; lastTime = e.timeStamp;
                size = axis === 'x'
                    ? panel.getBoundingClientRect().width
                    : panel.getBoundingClientRect().height;
                reset();
            }, { passive: true });

            panel.addEventListener('touchmove', (e: TouchEvent) => {
                if (e.touches.length !== 1) return;
                if (!flyout.open || isInlineMode(flyout)) return;
                const t = e.touches[0];
                const along = axis === 'x' ? t.clientX - startX : t.clientY - startY;
                const cross = axis === 'x' ? t.clientY - startY : t.clientX - startX;
                const closeDelta = along * sign;

                if (!decided) {
                    if (Math.abs(along) < 8 && Math.abs(cross) < 8) return;
                    decided = true;
                    active = Math.abs(along) > Math.abs(cross)
                        && closeDelta > 0
                        && atCloseScrollBoundary(panel, position);
                    if (active) panel.style.transition = 'none';
                }
                if (!active) return;

                e.preventDefault();
                const moved = Math.max(0, closeDelta);
                const dt = e.timeStamp - lastTime;
                if (dt > 0) velocity = (moved - progress) / dt;
                progress = moved; lastTime = e.timeStamp;
                panel.style.transform = axis === 'x'
                    ? `translateX(${sign * moved}px)`
                    : `translateY(${sign * moved}px)`;
            }, { passive: false });

            function end() {
                if (!active) { reset(); return; }
                const shouldClose = (size > 0 && progress > size * 0.4) || velocity > 0.5;
                reset();
                isTransitioning = true;
                if (shouldClose) {
                    const off = axis === 'x' ? `translateX(${sign * 100}%)` : `translateY(${sign * 100}%)`;
                    settle(off, () => { isTransitioning = false; close({ immediate: true }); });
                } else {
                    settle(axis === 'x' ? 'translateX(0)' : 'translateY(0)', () => { isTransitioning = false; });
                }
            }

            panel.addEventListener('touchend', end, { passive: true });
            panel.addEventListener('touchcancel', end, { passive: true });
        });
    }

    function setupSwipeOpen(position: FlyoutPosition) {
        const EDGE = 24;
        const THRESHOLD = 48;
        let tracking = false;
        let startX = 0, startY = 0;

        document.addEventListener('touchstart', (e: TouchEvent) => {
            if (!flyout.isConnected || e.touches.length !== 1) return;
            if (flyout.open || isInlineMode(flyout) || isTransitioning) return;
            const t = e.touches[0];
            if (!inOpenEdgeZone(t.clientX, t.clientY, position, EDGE)) return;
            tracking = true; startX = t.clientX; startY = t.clientY;
        }, { passive: true });

        document.addEventListener('touchmove', (e: TouchEvent) => {
            if (!tracking || e.touches.length !== 1) return;
            const t = e.touches[0];
            const { inward, cross } = projectOpenSwipe(position, t.clientX - startX, t.clientY - startY);
            if (inward > THRESHOLD && inward > Math.abs(cross)) {
                tracking = false;
                open();
            }
        }, { passive: true });

        const stop = () => { tracking = false; };
        document.addEventListener('touchend', stop, { passive: true });
        document.addEventListener('touchcancel', stop, { passive: true });
    }

    const swipeMode = getSwipeMode(flyout);
    if (swipeMode) {
        const position = getFlyoutPosition(flyout);
        if (swipeMode === 'close' || swipeMode === 'both') setupSwipeClose(position);
        if (swipeMode === 'open' || swipeMode === 'both') setupSwipeOpen(position);
    }

    // Store API
    (flyout as any)._hui = { open, close };

    // Auto-open
    if (flyout.hasAttribute('data-hui-flyout-open')) {
        flyout.removeAttribute('data-hui-flyout-open');
        open();
    }
}

let _id = 0;
function uniqueId(): string {
    return `hui-${++_id}-${Date.now()}`;
}

function bindTriggers(root: Root) {
    const triggers = Array.from(root.querySelectorAll<HTMLElement>('[data-hui-flyout-trigger]'));
    triggers.forEach((trigger) => {
        if (trigger.hasAttribute('data-hui-flyout-trigger-bound')) return;
        trigger.setAttribute('data-hui-flyout-trigger-bound', '');
        trigger.addEventListener('click', () => {
            const targetId = trigger.getAttribute('data-hui-flyout-trigger');
            if (!targetId) return;
            const flyout = document.getElementById(targetId) as HTMLDialogElement | null;
            if (!flyout || !(flyout as any)._hui) return;
            (flyout as any)._hui.open();
        });
    });
}

// --- Public JS API ---

export function openFlyout(id: string): void {
    const flyout = document.getElementById(id) as HTMLDialogElement | null;
    if (!flyout || !(flyout as any)._hui) return;
    (flyout as any)._hui.open();
}

export function closeFlyout(id: string): void {
    const flyout = document.getElementById(id) as HTMLDialogElement | null;
    if (!flyout || !(flyout as any)._hui) return;
    (flyout as any)._hui.close();
}

// --- Registration ---

export function registerFlyouts(root: Root = document) {
    const flyouts = Array.from(root.querySelectorAll<HTMLDialogElement>('[data-hui-flyout]'));
    flyouts.forEach(setupFlyout);
    bindTriggers(root);
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => registerFlyouts());
    } else {
        registerFlyouts();
    }
}
