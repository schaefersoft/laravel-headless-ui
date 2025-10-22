type Root = Document | HTMLElement;

export function registerSliders(root: Root = document) {
    const containers = Array.from(root.querySelectorAll<HTMLElement>('[data-hui-slider]'));

    containers.forEach((container) => {
        const input = container.querySelector<HTMLInputElement>('.hui-slider-input') || undefined;

        const getDisabled = () => container.getAttribute('aria-disabled') === 'true';
        const setAria = (checked: boolean) => container.setAttribute('aria-checked', checked ? 'true' : 'false');
        const isChecked = () => container.getAttribute('aria-checked') === 'true';

        const initChecked = input ? !!input.checked : isChecked();
        setAria(initChecked);

        function reflectToInput(checked: boolean) {
            if (!input) return;
            if (input.checked !== checked) {
                input.checked = checked;
                input.dispatchEvent(new Event('input', {bubbles: true}));
                input.dispatchEvent(new Event('change', {bubbles: true}));
            }
        }

        function setChecked(checked: boolean) {
            setAria(checked);
            reflectToInput(checked);
        }

        function toggle() {
            if (getDisabled()) return;
            setChecked(!isChecked());
        }

        container.addEventListener('click', (e) => {
            if (getDisabled()) return;

            toggle();
        });

        container.addEventListener('keydown', (e: KeyboardEvent) => {
            if (getDisabled()) return;
            const key = e.key;
            if (key === ' ' || key === 'Spacebar' || key === 'Enter') {
                e.preventDefault();
                toggle();
            } else if (key === 'ArrowRight' || key === 'End') {
                e.preventDefault();
                setChecked(true);
            } else if (key === 'ArrowLeft' || key === 'Home') {
                e.preventDefault();
                setChecked(false);
            }
        });

        if (input) {
            input.addEventListener('change', () => setChecked(!!input.checked));
            const mo = new MutationObserver(() => {
                container.setAttribute('aria-disabled', input.disabled ? 'true' : 'false');
                setChecked(!!input.checked);
            });
            mo.observe(input, {attributes: true, attributeFilter: ['disabled', 'checked']});
        }
    });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => registerSliders());
    } else {
        registerSliders();
    }
}
