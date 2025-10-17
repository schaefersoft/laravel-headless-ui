type Root = Document | HTMLElement;

function clamp(n: number, min: number, max: number) {
    return Math.min(Math.max(n, min), max);
}

function pct(value: number, min: number, max: number) {
    if (max === min) return 0;
    return ((value - min) / (max - min)) * 100;
}

export function registerRangeSliders(root: Root = document) {
    const containers = Array.from(root.querySelectorAll<HTMLElement>('[data-hui-range-slider]'));

    containers.forEach((container) => {
        const track = container.querySelector<HTMLElement>('[data-hui-range-slider-track]') || container;
        const fill = container.querySelector<HTMLElement>('[data-hui-range-slider-track-value]');
        const minThumb = container.querySelector<HTMLInputElement>('input.hui-range-slider-thumb[data-hui-range-slider-thumb="min"]');
        const maxThumb = container.querySelector<HTMLInputElement>('input.hui-range-slider-thumb[data-hui-range-slider-thumb="max"]');
        const hasMax = !!maxThumb;
        const thumbs = [minThumb, maxThumb].filter(Boolean) as HTMLInputElement[];
        if (!minThumb && !maxThumb) return;

        const getBounds = () => {
            const source = (minThumb || maxThumb)!;
            const min = Number(source.min || '0');
            const max = Number(source.max || '100');
            const step = Number(source.step || '1');
            return { min, max, step };
        };
        const { min: rangeMin, max: rangeMax, step: rangeStep } = getBounds();

        function updateDisabled() {
            const anyEnabled = thumbs.some(t => !t.disabled);
            container.setAttribute('aria-disabled', anyEnabled ? 'false' : 'true');
        }

        function updateFill(from: 'min' | 'max' | 'init' = 'init') {
            let lo = Number(minThumb?.value ?? rangeMin);
            let hi = hasMax ? Number(maxThumb!.value) : rangeMax;

            lo = clamp(lo, rangeMin, rangeMax);
            hi = clamp(hi, rangeMin, rangeMax);

            // Prevent crossing, but do not otherwise interfere with native drag
            if (hasMax) {
                if (from === 'min' && lo > hi) lo = hi;
                if (from === 'max' && hi < lo) hi = lo;
            }

            if (minThumb && Number(minThumb.value) !== lo) minThumb.value = String(lo);
            if (hasMax && Number(maxThumb!.value) !== hi) maxThumb!.value = String(hi);

            if (fill) {
                if (hasMax) {
                    // Two-thumb (or single max) – fill between lo and hi
                    const left = pct(lo, rangeMin, rangeMax);
                    const right = pct(hi, rangeMin, rangeMax);
                    fill.style.left = `${left}%`;
                    fill.style.width = `${Math.max(0, right - left)}%`;
                } else {
                    // Single min – treat missing max as rangeMax and fill from thumb to end
                    const left = pct(lo, rangeMin, rangeMax);
                    fill.style.left = `${left}%`;
                    fill.style.width = `${Math.max(0, 100 - left)}%`;
                }
            }
        }

        // Native drag: rely on browser; just update fill and keep lower <= upper
        if (minThumb) {
            minThumb.addEventListener('input', () => updateFill('min'));
            minThumb.addEventListener('change', () => updateFill('min'));
        }
        if (maxThumb) {
            maxThumb.addEventListener('input', () => updateFill('max'));
            maxThumb.addEventListener('change', () => updateFill('max'));
        }

        // Click-to-move: clicking without dragging moves the nearest thumb
        function handleClickAt(clientX: number) {
            if ((!minThumb || minThumb.disabled) && (!maxThumb || maxThumb.disabled)) return;
            const rect = track.getBoundingClientRect();
            const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
            const raw = rangeMin + ratio * (rangeMax - rangeMin);
            const snapped = Math.round((raw - rangeMin) / (rangeStep || 1)) * (rangeStep || 1) + rangeMin;

            const lo = Number(minThumb?.value ?? rangeMin);
            const hi = hasMax ? Number(maxThumb!.value) : rangeMax;
            const distLo = Math.abs(snapped - lo);
            const distHi = hasMax ? Math.abs(snapped - hi) : Infinity;

            let target: 'min' | 'max' = 'min';
            if (hasMax && !maxThumb!.disabled) {
                if (minThumb && !minThumb.disabled) {
                    // Prefer the closer thumb; when same distance, choose based on side of midpoint
                    if (distHi === distLo) {
                        const mid = (lo + hi) / 2;
                        target = snapped > mid ? 'max' : 'min';
                    } else {
                        target = distHi < distLo ? 'max' : 'min';
                    }
                } else {
                    target = 'max';
                }
            }

            if (target === 'min' && minThumb) {
                const next = clamp(snapped, rangeMin, hasMax ? Number(maxThumb!.value) : rangeMax);
                if (String(next) !== minThumb.value) {
                    minThumb.value = String(next);
                    minThumb.dispatchEvent(new Event('input', { bubbles: true }));
                    minThumb.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                    updateFill('min');
                }
            } else if (target === 'max' && maxThumb) {
                const next = clamp(snapped, minThumb ? Number(minThumb.value) : rangeMin, rangeMax);
                if (String(next) !== maxThumb.value) {
                    maxThumb.value = String(next);
                    maxThumb.dispatchEvent(new Event('input', { bubbles: true }));
                    maxThumb.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                    updateFill('max');
                }
            }
        }

        function installClickToMove(el: HTMLElement) {
            let downX = 0;
            let moved = false;
            let pointerId: number | null = null;
            const DRIFT = 4;

            const onPointerMove = (e: PointerEvent) => {
                if (pointerId !== null && e.pointerId !== pointerId) return;
                if (Math.abs(e.clientX - downX) > DRIFT) moved = true;
            };
            const onPointerUp = (e: PointerEvent) => {
                if (pointerId !== null && e.pointerId !== pointerId) return;
                window.removeEventListener('pointermove', onPointerMove, true);
                window.removeEventListener('pointerup', onPointerUp, true);
                window.removeEventListener('pointercancel', onPointerUp, true);
                if (!moved) {
                    handleClickAt(e.clientX);
                    e.preventDefault();
                    e.stopPropagation();
                }
                moved = false;
                pointerId = null;
            };
            el.addEventListener('pointerdown', (e: PointerEvent) => {
                downX = e.clientX;
                moved = false;
                pointerId = e.pointerId;
                window.addEventListener('pointermove', onPointerMove, true);
                window.addEventListener('pointerup', onPointerUp, true);
                window.addEventListener('pointercancel', onPointerUp, true);
            }, true);

            // Mouse fallback
            let mouseDownX = 0;
            let mouseMoved = false;
            const onMouseMove = (e: MouseEvent) => { if (Math.abs(e.clientX - mouseDownX) > DRIFT) mouseMoved = true; };
            const onMouseUp = (e: MouseEvent) => {
                window.removeEventListener('mousemove', onMouseMove, true);
                window.removeEventListener('mouseup', onMouseUp, true);
                if (!mouseMoved) {
                    handleClickAt(e.clientX);
                    e.preventDefault();
                    e.stopPropagation();
                }
                mouseMoved = false;
            };
            el.addEventListener('mousedown', (e: MouseEvent) => {
                mouseDownX = e.clientX;
                mouseMoved = false;
                window.addEventListener('mousemove', onMouseMove, true);
                window.addEventListener('mouseup', onMouseUp, true);
            }, true);
        }
        installClickToMove(container);

        const mo = new MutationObserver(() => updateDisabled());
        thumbs.forEach(t => mo.observe(t, { attributes: true, attributeFilter: ['disabled'] }));

        updateDisabled();
        updateFill('init');
    });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => registerRangeSliders());
    } else {
        registerRangeSliders();
    }
}
