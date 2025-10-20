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

        function onKeydown(e: KeyboardEvent) {
            if (e.key === 'Escape' || (e as any).key === 'Esc') {
                hide();
            }
        }

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

            // Determine preferred base placement from attribute, default to top
            const preferredAttr = content.getAttribute('data-hui-tooltip-position') || 'top';
            const preferred = (preferredAttr === 'bottom' || preferredAttr === 'left' || preferredAttr === 'right') ? preferredAttr : 'top';

            // Available spaces in each direction
            const spaceTop = host.top;
            const spaceBottom = vh - host.bottom;
            const spaceLeft = host.left;
            const spaceRight = vw - host.right;

            const fitsTop = spaceTop >= h + gap;
            const fitsBottom = spaceBottom >= h + gap;
            const fitsLeft = spaceLeft >= w + gap;
            const fitsRight = spaceRight >= w + gap;

            // Build candidate list: first try preferred, then its opposite,
            // then fall back to the orthogonal axis ordered by available space.
            type Placement = 'top' | 'bottom' | 'left' | 'right';
            const opposite: Record<Placement, Placement> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
            let secondary: Placement[];
            if (preferred === 'top' || preferred === 'bottom') {
                secondary = spaceLeft >= spaceRight ? ['left', 'right'] as Placement[] : ['right', 'left'] as Placement[];
            } else {
                secondary = spaceTop >= spaceBottom ? ['top', 'bottom'] as Placement[] : ['bottom', 'top'] as Placement[];
            }

            const candidates: Placement[] = [preferred as Placement, opposite[preferred as Placement], ...secondary];

            let placement: Placement | null = null;
            for (const cand of candidates) {
                if ((cand === 'top' && fitsTop) || (cand === 'bottom' && fitsBottom) || (cand === 'left' && fitsLeft) || (cand === 'right' && fitsRight)) {
                    placement = cand;
                    break;
                }
            }
            // If nothing fits fully, choose the side with the most space overall
            if (placement === null) {
                const spaceByPlacement: Record<Placement, number> = {
                    top: spaceTop, bottom: spaceBottom, left: spaceLeft, right: spaceRight
                };
                placement = (['top','bottom','left','right'] as Placement[]).reduce((best, p) => spaceByPlacement[p] > spaceByPlacement[best] ? p : best, 'top');
            }

            // Compute position based on final placement and clamp within viewport
            let x: number, y: number;
            if (placement === 'top') {
                y = host.top - h - gap;
                x = host.left + (host.width / 2) - (w / 2);
                y = clamp(y, gap, Math.max(gap, vh - gap - h));
                x = clamp(x, gap, Math.max(gap, vw - gap - w));
            } else if (placement === 'bottom') {
                y = host.bottom + gap;
                x = host.left + (host.width / 2) - (w / 2);
                y = clamp(y, gap, Math.max(gap, vh - gap - h));
                x = clamp(x, gap, Math.max(gap, vw - gap - w));
            } else if (placement === 'left') {
                x = host.left - w - gap;
                y = host.top + (host.height / 2) - (h / 2);
                x = clamp(x, gap, Math.max(gap, vw - gap - w));
                y = clamp(y, gap, Math.max(gap, vh - gap - h));
            } else { // right
                x = host.right + gap;
                y = host.top + (host.height / 2) - (h / 2);
                x = clamp(x, gap, Math.max(gap, vw - gap - w));
                y = clamp(y, gap, Math.max(gap, vh - gap - h));
            }

            content.style.left = `${Math.round(x)}px`;
            content.style.top = `${Math.round(y)}px`;

            // Update placement for styling (e.g., arrow orientation)
            content.setAttribute('data-placement', placement);

            // Compute arrow offsets relative to content
            if (placement === 'top' || placement === 'bottom') {
                const hostCenterX = host.left + (host.width / 2);
                const arrowX = clamp(hostCenterX - x, 6, Math.max(6, w - 6));
                content.style.setProperty('--hui-tooltip-arrow-x', `${Math.round(arrowX)}px`);
                content.style.removeProperty('--hui-tooltip-arrow-y');
            } else {
                const hostCenterY = host.top + (host.height / 2);
                const arrowY = clamp(hostCenterY - y, 6, Math.max(6, h - 6));
                content.style.setProperty('--hui-tooltip-arrow-y', `${Math.round(arrowY)}px`);
                content.style.removeProperty('--hui-tooltip-arrow-x');
            }

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
            document.addEventListener('keydown', onKeydown, true);
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
            document.removeEventListener('keydown', onKeydown, true);
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
