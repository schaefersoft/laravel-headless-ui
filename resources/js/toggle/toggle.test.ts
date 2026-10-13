import { describe, it, expect, beforeEach, vi } from 'vitest';
import { registerToggles } from './toggle';

function createToggle(opts: { checked?: boolean; disabled?: boolean; name?: string } = {}): HTMLElement {
    document.body.innerHTML = `
        <div data-hui-toggle
             class="hui-toggle"
             role="switch"
             tabindex="${opts.disabled ? '-1' : '0'}"
             aria-checked="${opts.checked ? 'true' : 'false'}"
             aria-disabled="${opts.disabled ? 'true' : 'false'}">
            <div class="hui-toggle-thumb" aria-hidden="true"></div>
            ${opts.name ? `<input type="checkbox" class="hui-toggle-input" name="${opts.name}" ${opts.checked ? 'checked' : ''} ${opts.disabled ? 'disabled' : ''} hidden>` : ''}
        </div>
    `;
    registerToggles();
    return document.querySelector<HTMLElement>('[data-hui-toggle]')!;
}

function getInput(toggle: HTMLElement): HTMLInputElement {
    return toggle.querySelector<HTMLInputElement>('.hui-toggle-input')!;
}

function press(el: HTMLElement, key: string, init: KeyboardEventInit = {}): KeyboardEvent {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init });
    el.dispatchEvent(event);
    return event;
}

describe('Toggle', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('toggles on click', () => {
        const toggle = createToggle();

        toggle.click();
        expect(toggle.getAttribute('aria-checked')).toBe('true');

        toggle.click();
        expect(toggle.getAttribute('aria-checked')).toBe('false');
    });

    it('toggles on Space', () => {
        const toggle = createToggle();

        press(toggle, ' ');
        expect(toggle.getAttribute('aria-checked')).toBe('true');

        press(toggle, ' ');
        expect(toggle.getAttribute('aria-checked')).toBe('false');
    });

    it('toggles on Enter', () => {
        const toggle = createToggle({ checked: true });

        press(toggle, 'Enter');

        expect(toggle.getAttribute('aria-checked')).toBe('false');
    });

    it('prevents page scroll on Space', () => {
        const toggle = createToggle();

        const event = press(toggle, ' ');

        expect(event.defaultPrevented).toBe(true);
    });

    it('does not toggle repeatedly while a key is held', () => {
        const toggle = createToggle();

        press(toggle, ' ');
        press(toggle, ' ', { repeat: true });
        press(toggle, ' ', { repeat: true });

        expect(toggle.getAttribute('aria-checked')).toBe('true');
    });

    it('ignores other keys', () => {
        const toggle = createToggle();

        const event = press(toggle, 'a');
        press(toggle, 'ArrowRight');
        press(toggle, 'Tab');

        expect(toggle.getAttribute('aria-checked')).toBe('false');
        expect(event.defaultPrevented).toBe(false);
    });

    it('mirrors the state to the thumb', () => {
        const toggle = createToggle();
        const thumb = toggle.querySelector<HTMLElement>('.hui-toggle-thumb')!;

        press(toggle, ' ');

        expect(thumb.getAttribute('aria-checked')).toBe('true');
    });

    it('does not toggle when disabled', () => {
        const toggle = createToggle({ disabled: true });

        toggle.click();
        press(toggle, ' ');
        press(toggle, 'Enter');

        expect(toggle.getAttribute('aria-checked')).toBe('false');
    });

    it('syncs the hidden input and dispatches change on keyboard toggle', () => {
        const toggle = createToggle({ name: 'my_toggle' });
        const input = getInput(toggle);
        const onChange = vi.fn();
        input.addEventListener('change', onChange);

        press(toggle, ' ');

        expect(input.checked).toBe(true);
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('updates focusability when the input is disabled or enabled', async () => {
        const toggle = createToggle({ name: 'my_toggle' });
        const input = getInput(toggle);

        input.disabled = true;
        await new Promise((resolve) => setTimeout(resolve));

        expect(toggle.getAttribute('aria-disabled')).toBe('true');
        expect(toggle.tabIndex).toBe(-1);

        input.disabled = false;
        await new Promise((resolve) => setTimeout(resolve));

        expect(toggle.getAttribute('aria-disabled')).toBe('false');
        expect(toggle.tabIndex).toBe(0);
    });
});
