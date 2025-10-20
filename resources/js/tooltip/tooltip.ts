type Root = Document | HTMLElement;

function clamp(n: number, min: number, max: number) {
    return Math.min(Math.max(n, min), max);
}

export function registerTooltips(root: Root = document) {
    const containers = Array.from(root.querySelectorAll<HTMLElement>('[data-hui-tooltip]'));

    containers.forEach((container) => {
        let content = container.querySelector<HTMLElement>('[data-hui-tooltip-content]');
        if (!content || content === null) return;

        content = content as HTMLElement;

        // Use fixed so we can keep inside viewport regardless of ancestors
        content.style.position = 'fixed';
        content.style.left = '-10000px';
        content.style.top = '-10000px';

        let open = false;
        let pointerInside = false;
        let hideTimer: number | null = null;
        let isTouch = false;

        function measure(): { w: number; h: number } {
            if (content === null) return {w: 0, h: 0};

            const prevDisplay = content.style.display;
            const prevVis = content.style.visibility;
            content.style.visibility = 'hidden';
            content.style.display = 'block';
            const rect = content.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;
            content.style.display = prevDisplay || '';
            content.style.visibility = prevVis || '';
            return {w, h};
        }

        function position(): void {
            if (content === null) return;

            const {innerWidth: vw, innerHeight: vh} = window;
            const host = container.getBoundingClientRect();
            const {w, h} = measure();
            const gap = 8;

            // Prefer top, flip to bottom if not enough space
            const preferTop = host.top >= h + gap;
            let y = preferTop ? (host.top - h - gap) : (host.bottom + gap);
            y = clamp(y, gap, Math.max(gap, vh - gap - h));

            let x = host.left + (host.width / 2) - (w / 2);
            x = clamp(x, gap, Math.max(gap, vw - gap - w));

            content.style.left = `${Math.round(x)}px`;
            content.style.top = `${Math.round(y)}px`;

            content.setAttribute('data-placement', preferTop ? 'top' : 'bottom');

            // Compute arrow offset relative to content if arrow is enabled
            // Position arrow towards the host center, clamped within content width
            const hostCenterX = host.left + (host.width / 2);
            const arrowX = clamp(hostCenterX - x, 6, Math.max(6, w - 6));
            content.style.setProperty('--hui-tooltip-arrow-x', `${Math.round(arrowX)}px`);

            // Sync arrow color with actual background color of content
            try {
                const bg = getComputedStyle(content).backgroundColor;
                const isTransparent = !bg || bg === 'transparent' || /rgba\([^\)]*,\s*0\s*\)/.test(bg);
                if (!isTransparent) {
                    content.style.setProperty('--hui-tooltip-bg', bg);
                } else {
                    content.style.removeProperty('--hui-tooltip-bg');
                }
            } catch (_) {
            }
        }

        function show(): void {
            if (content === null) return;

            if (open) return;

            open = true;
            content.style.display = 'block';
            content.setAttribute('aria-hidden', 'false');
            content.setAttribute('data-open', 'true');
            position();
            window.addEventListener('scroll', onScroll, true);
            window.addEventListener('resize', onResize, true);
            document.addEventListener('pointerdown', onOutsidePointerDown, true);
        }

        function hide() {
            if (content === null) return;

            if (!open) return;

            open = false;
            content.style.display = 'none';
            content.setAttribute('aria-hidden', 'true');
            content.setAttribute('data-open', 'false');
            window.removeEventListener('scroll', onScroll, true);
            window.removeEventListener('resize', onResize, true);
            document.removeEventListener('pointerdown', onOutsidePointerDown, true);
        }

        function onOutsidePointerDown(e: PointerEvent) {
            if (!container.contains(e.target as Node)) {
                hide();
            }
        }

        function onScroll() {
            if (open) position();
        }

        function onResize() {
            if (open) position();
        }

        // Hover/focus behavior for desktop: treat container+content as one hover zone
        function armHideCheck() {
            if (hideTimer !== null) window.clearTimeout(hideTimer);
            hideTimer = window.setTimeout(() => {
                if (!pointerInside) hide();
            }, 60);
        }

        function onEnter(e: PointerEvent) {
            isTouch = e.pointerType === 'touch';
            if (isTouch) return;
            pointerInside = true;
            if (hideTimer !== null) {
                window.clearTimeout(hideTimer);
                hideTimer = null;
            }
            show();
        }

        function onLeave() {
            if (isTouch) return;
            pointerInside = false;
            armHideCheck();
        }

        container.addEventListener('pointerenter', onEnter);
        container.addEventListener('pointerleave', onLeave);
        content.addEventListener('pointerenter', onEnter);
        content.addEventListener('pointerleave', onLeave);

        container.addEventListener('focusin', () => show());
        container.addEventListener('focusout', () => {
            // Give a tick for focus to move within container
            setTimeout(() => {
                const active = document.activeElement;
                if (active && container.contains(active)) return;
                hide();
            }, 0);
        });

        // Touch/click to open; outside click closes
        container.addEventListener('pointerup', (e) => {
            if (e.pointerType === 'touch' || e.pointerType === 'pen') {
                isTouch = true;
                show();
            }
        });
        container.addEventListener('click', (e) => {
            // Mouse click should not toggle on hover flows; keep open due to hover
            if (isTouch) {
                show();
            }
        });
    });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => registerTooltips());
    } else {
        registerTooltips();
    }
}
