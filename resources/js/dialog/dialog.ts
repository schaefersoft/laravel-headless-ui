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

function trapFocus(dialog: HTMLElement, e: KeyboardEvent) {
    if (e.key !== 'Tab') return;

    const focusable = getFocusable(dialog);
    if (focusable.length === 0) {
        e.preventDefault();
        return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
        if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
        }
    } else {
        if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
}

// --- Transition helpers ---

function getTransitionClasses(el: HTMLElement, prefix: string): { base: string[]; from: string[]; to: string[] } {
    const base = (el.getAttribute(`${prefix}`) || '').split(/\s+/).filter(Boolean);
    const from = (el.getAttribute(`${prefix}-from`) || '').split(/\s+/).filter(Boolean);
    const to = (el.getAttribute(`${prefix}-to`) || '').split(/\s+/).filter(Boolean);
    return { base, from, to };
}

function hasTransition(el: HTMLElement, prefix: string): boolean {
    return el.hasAttribute(prefix) || el.hasAttribute(`${prefix}-from`) || el.hasAttribute(`${prefix}-to`);
}

function nextFrame(): Promise<void> {
    return new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
}

function afterTransition(el: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
        const styles = getComputedStyle(el);
        const duration = parseFloat(styles.transitionDuration || '0');
        const delay = parseFloat(styles.transitionDelay || '0');
        const total = (duration + delay) * 1000;

        if (total <= 0) {
            resolve();
            return;
        }

        let done = false;
        const finish = () => {
            if (done) return;
            done = true;
            el.removeEventListener('transitionend', finish);
            resolve();
        };

        el.addEventListener('transitionend', finish, { once: true });
        // Safety timeout in case transitionend doesn't fire
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
    // Do NOT remove classes here — element will be hidden by dialog.close()
}

function cleanupLeaveTransition(el: HTMLElement, prefix: string): void {
    const { base, to } = getTransitionClasses(el, prefix);
    el.classList.remove(...base, ...to);
}

function getTransitionTargets(dialog: HTMLDialogElement): HTMLElement[] {
    const targets: HTMLElement[] = [];
    if (hasTransition(dialog, 'data-hui-dialog-enter') || hasTransition(dialog, 'data-hui-dialog-leave')) {
        targets.push(dialog);
    }
    targets.push(...Array.from(dialog.querySelectorAll<HTMLElement>(
        '[data-hui-dialog-enter], [data-hui-dialog-leave]'
    )));
    return targets;
}

// --- Dialog setup ---

function setupDialog(dialog: HTMLDialogElement) {
    if (dialog.hasAttribute('data-hui-dialog-initialized')) return;
    dialog.setAttribute('data-hui-dialog-initialized', '');

    let previouslyFocused: HTMLElement | null = null;
    let isTransitioning = false;

    const noEscape = dialog.hasAttribute('data-hui-dialog-no-escape');
    const noBackdropClose = dialog.hasAttribute('data-hui-dialog-no-backdrop-close');
    const scrollLock = dialog.hasAttribute('data-hui-dialog-scroll-lock');

    function open() {
        if (dialog.open || isTransitioning) return;

        previouslyFocused = document.activeElement as HTMLElement | null;

        // Apply enter-from classes BEFORE showModal to prevent flicker
        const targets = getTransitionTargets(dialog);
        const enterTargets = targets.filter((t) => hasTransition(t, 'data-hui-dialog-enter'));
        enterTargets.forEach((t) => prepareEnterTransition(t, 'data-hui-dialog-enter'));

        dialog.showModal();
        dialog.setAttribute('data-hui-dialog-open', '');

        if (scrollLock) {
            document.body.style.overflow = 'hidden';
        }

        const focusable = getFocusable(dialog);
        if (focusable.length > 0) {
            focusable[0].focus();
        }

        // Run the enter transitions (from → to)
        if (enterTargets.length > 0) {
            Promise.all(enterTargets.map((t) => startEnterTransition(t, 'data-hui-dialog-enter')));
        }

        dialog.dispatchEvent(new CustomEvent('hui:dialog:open', { bubbles: true }));
    }

    function close() {
        if (!dialog.open || isTransitioning) return;

        // Run leave transitions on all targets
        const targets = getTransitionTargets(dialog);
        const leaveTargets = targets.filter((t) => hasTransition(t, 'data-hui-dialog-leave'));

        function finishClose() {
            dialog.close();
            dialog.removeAttribute('data-hui-dialog-open');

            if (scrollLock) {
                const otherLocked = document.querySelector<HTMLDialogElement>(
                    'dialog[data-hui-dialog][data-hui-dialog-scroll-lock][open]'
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
            dialog.dispatchEvent(new CustomEvent('hui:dialog:close', { bubbles: true }));
        }

        if (leaveTargets.length > 0) {
            isTransitioning = true;
            const transitions = leaveTargets.map((t) => runLeaveTransition(t, 'data-hui-dialog-leave'));
            Promise.all(transitions).then(() => {
                finishClose();
                // Clean up leave classes after dialog is hidden
                leaveTargets.forEach((t) => cleanupLeaveTransition(t, 'data-hui-dialog-leave'));
            });
        } else {
            finishClose();
        }
    }

    // Focus trap
    dialog.addEventListener('keydown', (e: KeyboardEvent) => {
        trapFocus(dialog, e);
    });

    // Close on Escape (native <dialog> handles this, but we need cleanup)
    dialog.addEventListener('cancel', (e) => {
        e.preventDefault();
        if (!noEscape) {
            close();
        }
    });

    // Close on backdrop / background click
    dialog.addEventListener('click', (e) => {
        if (noBackdropClose) return;
        const target = e.target as HTMLElement;
        if (target === dialog || target.hasAttribute('data-hui-dialog-background')) {
            close();
        }
    });

    // Close buttons inside dialog
    dialog.addEventListener('click', (e) => {
        const target = (e.target as HTMLElement).closest<HTMLElement>('[data-hui-dialog-close]');
        if (target) {
            close();
        }
    });

    // ARIA: link title and description
    const title = dialog.querySelector<HTMLElement>('[data-hui-dialog-title]');
    const description = dialog.querySelector<HTMLElement>('[data-hui-dialog-description]');

    if (title) {
        if (!title.id) title.id = `hui-dialog-title-${uniqueId()}`;
        dialog.setAttribute('aria-labelledby', title.id);
    }

    if (description) {
        if (!description.id) description.id = `hui-dialog-desc-${uniqueId()}`;
        dialog.setAttribute('aria-describedby', description.id);
    }

    // Store open/close on the element for JS API access
    (dialog as any)._hui = { open, close };

    // Auto-open if data-hui-dialog-open was set in HTML
    if (dialog.hasAttribute('data-hui-dialog-open')) {
        // Remove and re-add to trigger proper open flow
        dialog.removeAttribute('data-hui-dialog-open');
        open();
    }
}

let _id = 0;
function uniqueId(): string {
    return `hui-${++_id}-${Date.now()}`;
}

function bindTriggers(root: Root) {
    const triggers = Array.from(root.querySelectorAll<HTMLElement>('[data-hui-dialog-trigger]'));

    triggers.forEach((trigger) => {
        if (trigger.hasAttribute('data-hui-dialog-trigger-bound')) return;
        trigger.setAttribute('data-hui-dialog-trigger-bound', '');

        trigger.addEventListener('click', () => {
            const targetId = trigger.getAttribute('data-hui-dialog-trigger');
            if (!targetId) return;

            const dialog = document.getElementById(targetId) as HTMLDialogElement | null;
            if (!dialog || !(dialog as any)._hui) return;

            (dialog as any)._hui.open();
        });
    });
}

// --- Public JS API ---

export function openDialog(id: string): void {
    const dialog = document.getElementById(id) as HTMLDialogElement | null;
    if (!dialog || !(dialog as any)._hui) return;
    (dialog as any)._hui.open();
}

export function closeDialog(id: string): void {
    const dialog = document.getElementById(id) as HTMLDialogElement | null;
    if (!dialog || !(dialog as any)._hui) return;
    (dialog as any)._hui.close();
}

// --- Registration ---

export function registerDialogs(root: Root = document) {
    const dialogs = Array.from(root.querySelectorAll<HTMLDialogElement>('[data-hui-dialog]'));
    dialogs.forEach(setupDialog);
    bindTriggers(root);
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => registerDialogs());
    } else {
        registerDialogs();
    }
}
