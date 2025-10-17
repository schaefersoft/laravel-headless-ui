type Root = Document | HTMLElement;

export function clamp(n: number, min: number, max: number) {
    return Math.min(Math.max(n, min), max);
}

export function pct(value: number, min: number, max: number) {
    if (max === min) return 0;
    return ((value - min) / (max - min)) * 100;
}

export function registerRangeSliders(root: Root = document) {
    //All range sliders on the page
    const containers = Array.from(root.querySelectorAll<HTMLElement>('[data-hui-range-slider]'));

    containers.forEach((container) => {
        //Track and track fill
        const track = container.querySelector<HTMLElement>('[data-hui-range-slider-track]') || container;
        const fill = container.querySelector<HTMLElement>('[data-hui-range-slider-track-value]');

        //Thumb controls for the slider
        const minThumb = container.querySelector<HTMLInputElement>('input.hui-range-slider-thumb[data-hui-range-slider-thumb="min"]');
        const maxThumb = container.querySelector<HTMLInputElement>('input.hui-range-slider-thumb[data-hui-range-slider-thumb="max"]');
        const hasMax = !!maxThumb;
        const thumbs = [minThumb, maxThumb].filter(Boolean) as HTMLInputElement[];

        // Optional mirrored inputs or display elements
        const minTargets = Array.from(container.querySelectorAll<HTMLElement>('[data-hui-range-slider-value="min"]'));
        const maxTargets = Array.from(container.querySelectorAll<HTMLElement>('[data-hui-range-slider-value="max"]'));
        const minInputs = minTargets.filter((el): el is HTMLInputElement => el instanceof HTMLInputElement);
        const maxInputs = maxTargets.filter((el): el is HTMLInputElement => el instanceof HTMLInputElement);
        const minDisplays = minTargets.filter((el) => !(el instanceof HTMLInputElement));
        const maxDisplays = maxTargets.filter((el) => !(el instanceof HTMLInputElement));

        if (!minThumb && !maxThumb) return;

        const getBounds = () => {
            const source = (minThumb || maxThumb)!;
            const min = Number(source.min || '0');
            const max = Number(source.max || '100');
            const step = Number(source.step || '1');
            return { min, max, step };
        };
        const { min: rangeMin, max: rangeMax, step: rangeStep } = getBounds();

        //Update the wrappers aria-disabled attribute if all o fthe thumbs are disabled
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

            // Reflect into optional inputs and display elements
            minInputs.forEach(input => { if (Number(input.value) !== lo) input.value = String(lo); });
            maxInputs.forEach(input => { if (hasMax && Number(input.value) !== hi) input.value = String(hi); });
            minDisplays.forEach(el => { if (el.textContent !== String(lo)) el.textContent = String(lo); });
            // Show the effective hi (rangeMax when single-thumb)
            maxDisplays.forEach(el => { const val = String(hi); if (el.textContent !== val) el.textContent = val; });

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

        // Helper to snap arbitrary values to the slider's step grid
        const snap = (value: number) => {
            const step = rangeStep || 1;
            return Math.round((value - rangeMin) / step) * step + rangeMin;
        };

        // Input fields -> thumbs
        if (minInputs.length && minThumb) {
            const applyMinFromInput = () => {
                // Use last edited input; all inputs mirror each other after updateFill
                const raw = Number(minInputs[minInputs.length - 1].value);
                if (Number.isNaN(raw)) return;
                const snapped = snap(raw);
                const upper = hasMax ? Number(maxThumb!.value) : rangeMax;
                const next = clamp(snapped, rangeMin, upper);
                if (String(next) !== minThumb.value) {
                    minThumb.value = String(next);
                    minThumb.dispatchEvent(new Event('input', { bubbles: true }));
                    minThumb.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                    updateFill('min');
                }
            };
            minInputs.forEach(input => {
                input.addEventListener('input', applyMinFromInput);
                input.addEventListener('change', applyMinFromInput);
            });
        }

        if (maxInputs.length && maxThumb) {
            const applyMaxFromInput = () => {
                const raw = Number(maxInputs[maxInputs.length - 1].value);
                if (Number.isNaN(raw)) return;
                const snapped = snap(raw);
                const lower = minThumb ? Number(minThumb.value) : rangeMin;
                const next = clamp(snapped, lower, rangeMax);
                if (String(next) !== maxThumb.value) {
                    maxThumb.value = String(next);
                    maxThumb.dispatchEvent(new Event('input', { bubbles: true }));
                    maxThumb.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                    updateFill('max');
                }
            };
            maxInputs.forEach(input => {
                input.addEventListener('input', applyMaxFromInput);
                input.addEventListener('change', applyMaxFromInput);
            });
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
        installClickToMove(track);

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
