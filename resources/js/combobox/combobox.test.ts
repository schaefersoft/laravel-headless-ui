import { describe, it, expect, beforeEach, vi } from 'vitest';
import { registerComboboxes, openCombobox, closeCombobox, getComboboxValue, setComboboxValue } from './combobox';

type Opts = {
    multiple?: boolean;
    searchable?: boolean;
    nullable?: boolean;
    disabled?: boolean;
    immediate?: boolean;
    open?: boolean;
    filter?: boolean;
    name?: string;
    value?: string[];
    chips?: string;
};

function createCombobox(opts: Opts = {}): HTMLElement {
    const flags = [
        opts.multiple ? 'data-hui-combobox-multiple' : '',
        opts.searchable === false ? '' : 'data-hui-combobox-searchable',
        opts.nullable ? 'data-hui-combobox-nullable' : '',
        opts.disabled ? 'data-hui-combobox-disabled' : '',
        opts.immediate ? 'data-hui-combobox-immediate' : '',
        opts.open ? 'data-hui-combobox-open' : '',
        opts.filter === false ? '' : 'data-hui-combobox-filter',
        opts.name ? `data-hui-combobox-name="${opts.name}"` : '',
    ].join(' ');

    document.body.innerHTML = `
        <form>
            <div data-hui-combobox id="cb" ${flags} data-hui-combobox-value='${JSON.stringify(opts.value ?? [])}'>
                ${opts.chips ?? ''}
                <input type="text" data-hui-combobox-input>
                <button data-hui-combobox-button>v</button>
                <div data-hui-combobox-options hidden>
                    <div data-hui-combobox-option data-value="1">Wade Cooper</div>
                    <div data-hui-combobox-option data-value="2">Arlene Mccoy</div>
                    <div data-hui-combobox-option data-value="3" data-disabled>Devon Webb</div>
                    <div data-hui-combobox-option data-value="4">Tom Cook</div>
                    <div data-hui-combobox-option data-value="5">Élodie Durand</div>
                    <div data-hui-combobox-no-results hidden>Nothing found</div>
                </div>
            </div>
        </form>
    `;
    registerComboboxes();
    return document.getElementById('cb')!;
}

const input = () => document.querySelector<HTMLInputElement>('[data-hui-combobox-input]')!;
const button = () => document.querySelector<HTMLButtonElement>('[data-hui-combobox-button]')!;
const options = () => document.querySelector<HTMLElement>('[data-hui-combobox-options]')!;
const option = (value: string) => document.querySelector<HTMLElement>(`[data-hui-combobox-option][data-value="${value}"]`)!;
const visible = () => Array.from(document.querySelectorAll<HTMLElement>('[data-hui-combobox-option]')).filter((o) => !o.hidden).map((o) => o.dataset.value);
const hiddenInputs = () => Array.from(document.querySelectorAll<HTMLInputElement>('input[data-hui-combobox-hidden-input]'));

function key(k: string, init: KeyboardEventInit = {}) {
    input().dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, ...init }));
}

function type(text: string) {
    input().value = text;
    input().dispatchEvent(new Event('input', { bubbles: true }));
}

describe('Combobox', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    // --- ARIA ---

    it('sets up ARIA attributes', () => {
        createCombobox();

        expect(input().getAttribute('role')).toBe('combobox');
        expect(input().getAttribute('aria-expanded')).toBe('false');
        expect(input().getAttribute('aria-controls')).toBe(options().id);
        expect(input().getAttribute('aria-autocomplete')).toBe('list');
        expect(options().getAttribute('role')).toBe('listbox');
        expect(option('1').getAttribute('role')).toBe('option');
        expect(option('3').getAttribute('aria-disabled')).toBe('true');
        expect(button().tabIndex).toBe(-1);
    });

    it('marks listbox multiselectable in multiple mode', () => {
        createCombobox({ multiple: true });
        expect(options().getAttribute('aria-multiselectable')).toBe('true');
    });

    // --- Open / Close ---

    it('toggles via button', () => {
        const root = createCombobox();

        button().click();
        expect(options().hidden).toBe(false);
        expect(root.hasAttribute('data-open')).toBe(true);
        expect(input().getAttribute('aria-expanded')).toBe('true');

        button().click();
        expect(options().hidden).toBe(true);
        expect(root.hasAttribute('data-open')).toBe(false);
    });

    it('opens on ArrowDown and activates first option', () => {
        createCombobox();
        key('ArrowDown');

        expect(options().hidden).toBe(false);
        expect(option('1').hasAttribute('data-active')).toBe(true);
        expect(input().getAttribute('aria-activedescendant')).toBe(option('1').id);
    });

    it('opens on ArrowUp and activates last option', () => {
        createCombobox();
        key('ArrowUp');
        expect(option('5').hasAttribute('data-active')).toBe(true);
    });

    it('closes on Escape', () => {
        createCombobox();
        key('ArrowDown');
        key('Escape');
        expect(options().hidden).toBe(true);
    });

    it('closes on outside pointerdown', async () => {
        createCombobox();
        button().click();
        await new Promise((r) => setTimeout(r, 0));

        document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
        expect(options().hidden).toBe(true);
    });

    it('opens on input click and stays open on further clicks', () => {
        createCombobox();
        input().click();
        expect(options().hidden).toBe(false);
        input().click();
        expect(options().hidden).toBe(false);
    });

    it('does not open on focus by default', () => {
        createCombobox();
        input().dispatchEvent(new FocusEvent('focus'));
        expect(options().hidden).toBe(true);
    });

    it('opens on focus when immediate', () => {
        createCombobox({ immediate: true });
        input().dispatchEvent(new FocusEvent('focus'));
        expect(options().hidden).toBe(false);
    });

    it('opens on init when open is set', () => {
        const root = createCombobox({ open: true, value: ['4'] });
        expect(options().hidden).toBe(false);
        expect(root.hasAttribute('data-open')).toBe(true);
        expect(option('4').hasAttribute('data-active')).toBe(true);

        key('Escape');
        expect(options().hidden).toBe(true);
    });

    it('does not open on init when open and disabled', () => {
        createCombobox({ open: true, disabled: true });
        expect(options().hidden).toBe(true);
    });

    it('opens and closes via JS API', () => {
        createCombobox();
        openCombobox('cb');
        expect(options().hidden).toBe(false);
        closeCombobox('cb');
        expect(options().hidden).toBe(true);
    });

    it('dispatches open and close events', () => {
        const root = createCombobox();
        const onOpen = vi.fn();
        const onClose = vi.fn();
        root.addEventListener('hui:combobox:open', onOpen);
        root.addEventListener('hui:combobox:close', onClose);

        openCombobox('cb');
        closeCombobox('cb');

        expect(onOpen).toHaveBeenCalledOnce();
        expect(onClose).toHaveBeenCalledOnce();
    });

    // --- Navigation ---

    it('skips disabled options', () => {
        createCombobox();
        key('ArrowDown');
        key('ArrowDown');
        key('ArrowDown');
        expect(option('4').hasAttribute('data-active')).toBe(true);
    });

    it('wraps around', () => {
        createCombobox();
        key('ArrowDown');
        key('ArrowUp');
        expect(option('5').hasAttribute('data-active')).toBe(true);
    });

    it('jumps to edges with PageUp/PageDown', () => {
        createCombobox();
        key('ArrowDown');
        key('PageDown');
        expect(option('5').hasAttribute('data-active')).toBe(true);
        key('PageUp');
        expect(option('1').hasAttribute('data-active')).toBe(true);
    });

    // --- Single selection ---

    it('selects on click and closes', () => {
        const root = createCombobox({ name: 'person' });
        const onChange = vi.fn();
        root.addEventListener('hui:combobox:change', onChange);

        button().click();
        option('2').click();

        expect(input().value).toBe('Arlene Mccoy');
        expect(options().hidden).toBe(true);
        expect(option('2').getAttribute('aria-selected')).toBe('true');
        expect(option('2').hasAttribute('data-selected')).toBe(true);
        expect(hiddenInputs().map((i) => i.value)).toEqual(['2']);
        expect(onChange.mock.calls[0][0].detail).toEqual({ value: '2', label: 'Arlene Mccoy' });
        expect(getComboboxValue('cb')).toBe('2');
    });

    it('selects active option on Enter', () => {
        createCombobox();
        key('ArrowDown');
        key('ArrowDown');
        key('Enter');
        expect(getComboboxValue('cb')).toBe('2');
    });

    it('does not select disabled options', () => {
        createCombobox();
        button().click();
        option('3').click();
        expect(getComboboxValue('cb')).toBeNull();
    });

    it('applies initial value', () => {
        createCombobox({ value: ['4'], name: 'person' });
        expect(input().value).toBe('Tom Cook');
        expect(option('4').getAttribute('aria-selected')).toBe('true');
        expect(hiddenInputs().map((i) => i.value)).toEqual(['4']);
    });

    it('activates the selected option when opening', () => {
        createCombobox({ value: ['4'] });
        button().click();
        expect(option('4').hasAttribute('data-active')).toBe(true);
    });

    it('renders an empty hidden input when nothing is selected', () => {
        createCombobox({ name: 'person' });
        expect(hiddenInputs().map((i) => i.value)).toEqual(['']);
    });

    it('restores selected label when closing after typing', () => {
        createCombobox({ value: ['1'] });
        type('arl');
        key('Escape');
        expect(input().value).toBe('Wade Cooper');
        expect(getComboboxValue('cb')).toBe('1');
    });

    it('keeps selection when cleared if not nullable', () => {
        createCombobox({ value: ['1'] });
        type('');
        key('Escape');
        expect(getComboboxValue('cb')).toBe('1');
    });

    it('clears selection when cleared if nullable', () => {
        createCombobox({ value: ['1'], nullable: true });
        type('');
        key('Escape');
        expect(getComboboxValue('cb')).toBeNull();
        expect(input().value).toBe('');
    });

    // --- Search ---

    it('filters options by query', () => {
        createCombobox();
        type('co');
        expect(options().hidden).toBe(false);
        expect(visible()).toEqual(['1', '2', '4']);
        expect(option('1').hasAttribute('data-active')).toBe(true);
    });

    it('ignores case and accents', () => {
        createCombobox();
        type('ELODIE');
        expect(visible()).toEqual(['5']);
    });

    it('shows no-results element', () => {
        createCombobox();
        const noResults = document.querySelector<HTMLElement>('[data-hui-combobox-no-results]')!;
        type('zzz');
        expect(visible()).toEqual([]);
        expect(noResults.hidden).toBe(false);
        expect(options().hasAttribute('data-empty')).toBe(true);

        type('');
        expect(noResults.hidden).toBe(true);
    });

    it('dispatches search event', () => {
        const root = createCombobox();
        const onSearch = vi.fn();
        root.addEventListener('hui:combobox:search', onSearch);
        type('wa');
        expect(onSearch.mock.calls[0][0].detail).toEqual({ query: 'wa' });
    });

    it('does not filter client-side when filter is disabled', () => {
        createCombobox({ filter: false });
        type('zzz');
        expect(visible()).toEqual(['1', '2', '3', '4', '5']);
    });

    it('picks up options added later', async () => {
        createCombobox({ filter: false });
        type('new');

        const added = document.createElement('div');
        added.setAttribute('data-hui-combobox-option', '');
        added.setAttribute('data-value', '9');
        added.textContent = 'New Person';
        options().appendChild(added);
        await new Promise((r) => setTimeout(r, 0));

        expect(added.getAttribute('role')).toBe('option');
        added.click();
        expect(getComboboxValue('cb')).toBe('9');
        expect(input().value).toBe('New Person');
    });

    // --- Non-searchable ---

    it('is readonly when not searchable', () => {
        createCombobox({ searchable: false });
        expect(input().readOnly).toBe(true);
        expect(input().getAttribute('aria-autocomplete')).toBe('none');
    });

    it('toggles on input click when not searchable', () => {
        createCombobox({ searchable: false });
        input().click();
        expect(options().hidden).toBe(false);
        input().click();
        expect(options().hidden).toBe(true);
    });

    it('supports type-ahead when not searchable', () => {
        createCombobox({ searchable: false });
        key('t');
        expect(options().hidden).toBe(false);
        expect(option('4').hasAttribute('data-active')).toBe(true);
    });

    it('selects with Space when not searchable', () => {
        createCombobox({ searchable: false });
        key(' ');
        key('ArrowDown');
        key(' ');
        expect(getComboboxValue('cb')).toBe('1');
    });

    // --- Multiple ---

    it('toggles values and stays open in multiple mode', () => {
        const root = createCombobox({ multiple: true, name: 'people[]' });
        const onChange = vi.fn();
        root.addEventListener('hui:combobox:change', onChange);

        button().click();
        option('1').click();
        option('4').click();

        expect(options().hidden).toBe(false);
        expect(getComboboxValue('cb')).toEqual(['1', '4']);
        expect(hiddenInputs().map((i) => [i.name, i.value])).toEqual([['people[]', '1'], ['people[]', '4']]);
        expect(onChange.mock.calls[1][0].detail).toEqual({ value: ['1', '4'], label: ['Wade Cooper', 'Tom Cook'] });

        option('1').click();
        expect(getComboboxValue('cb')).toEqual(['4']);
    });

    it('clears query after selecting in multiple mode', () => {
        createCombobox({ multiple: true });
        type('tom');
        key('Enter');
        expect(getComboboxValue('cb')).toEqual(['4']);
        expect(input().value).toBe('');
        expect(visible()).toEqual(['1', '2', '3', '4', '5']);
    });

    it('removes last value on Backspace with empty query', () => {
        createCombobox({ multiple: true, value: ['1', '2'] });
        key('Backspace');
        expect(getComboboxValue('cb')).toEqual(['1']);
    });

    it('renders default chips with remove buttons', () => {
        createCombobox({ multiple: true, value: ['1', '2'], chips: '<div data-hui-combobox-chips></div>' });

        const chips = document.querySelectorAll<HTMLElement>('[data-hui-combobox-chip]');
        expect(chips).toHaveLength(2);
        expect(chips[0].querySelector('[data-hui-combobox-chip-label]')!.textContent).toBe('Wade Cooper');

        const remove = chips[0].querySelector<HTMLButtonElement>('[data-hui-combobox-chip-remove]')!;
        expect(remove.getAttribute('aria-label')).toBe('Remove Wade Cooper');
        remove.click();

        expect(getComboboxValue('cb')).toEqual(['2']);
        expect(document.querySelectorAll('[data-hui-combobox-chip]')).toHaveLength(1);
    });

    it('renders chips from template', () => {
        createCombobox({
            multiple: true,
            value: ['4'],
            chips: `<div data-hui-combobox-chips><template data-hui-combobox-chip-template><span class="chip"><b data-hui-combobox-chip-label></b><i data-hui-combobox-chip-remove>x</i></span></template></div>`,
        });

        const chip = document.querySelector<HTMLElement>('[data-hui-combobox-chip]')!;
        expect(chip.className).toBe('chip');
        expect(chip.querySelector('b')!.textContent).toBe('Tom Cook');

        chip.querySelector<HTMLElement>('i')!.click();
        expect(getComboboxValue('cb')).toEqual([]);
    });

    // --- Disabled ---

    it('does not open when disabled', () => {
        const root = createCombobox({ disabled: true, name: 'person' });

        button().click();
        key('ArrowDown');

        expect(options().hidden).toBe(true);
        expect(input().disabled).toBe(true);
        expect(button().disabled).toBe(true);
        expect(root.hasAttribute('data-disabled')).toBe(true);
        expect(hiddenInputs()[0].disabled).toBe(true);
    });

    it('reacts to disabled attribute changes', async () => {
        const root = createCombobox();
        button().click();

        root.setAttribute('data-hui-combobox-disabled', '');
        await new Promise((r) => setTimeout(r, 0));

        expect(options().hidden).toBe(true);
        expect(input().disabled).toBe(true);

        root.removeAttribute('data-hui-combobox-disabled');
        await new Promise((r) => setTimeout(r, 0));

        expect(input().disabled).toBe(false);
    });

    // --- API / form ---

    it('sets value via JS API', () => {
        createCombobox();
        setComboboxValue('cb', '2');
        expect(input().value).toBe('Arlene Mccoy');
        setComboboxValue('cb', null);
        expect(input().value).toBe('');
    });

    it('restores initial value on form reset', async () => {
        createCombobox({ value: ['1'] });
        setComboboxValue('cb', '2');

        document.querySelector('form')!.reset();
        await new Promise((r) => setTimeout(r, 0));

        expect(getComboboxValue('cb')).toBe('1');
        expect(input().value).toBe('Wade Cooper');
    });

    // --- Positioning ---

    it('sets placement attributes and anchor width', () => {
        createCombobox();
        button().click();

        expect(options().getAttribute('data-placement')).toBe('bottom');
        expect(options().getAttribute('data-align')).toBe('start');
        expect(options().style.getPropertyValue('--hui-combobox-anchor-width')).toMatch(/px$/);
    });

    it('flips to top when there is no room below', () => {
        createCombobox();
        const rect = (top: number, height: number) => ({
            top, bottom: top + height, left: 10, right: 210, width: 200, height, x: 10, y: top, toJSON: () => ({}),
        }) as DOMRect;

        vi.spyOn(input(), 'getBoundingClientRect').mockReturnValue(rect(700, 36));
        vi.spyOn(options(), 'getBoundingClientRect').mockReturnValue(rect(0, 200));
        Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true });

        button().click();
        expect(options().getAttribute('data-placement')).toBe('top');
    });

    it('constrains height when neither side fits', () => {
        createCombobox();
        const rect = (top: number, height: number) => ({
            top, bottom: top + height, left: 10, right: 210, width: 200, height, x: 10, y: top, toJSON: () => ({}),
        }) as DOMRect;

        vi.spyOn(input(), 'getBoundingClientRect').mockReturnValue(rect(300, 36));
        vi.spyOn(options(), 'getBoundingClientRect').mockReturnValue(rect(0, 1000));
        Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true });

        button().click();
        expect(options().getAttribute('data-placement')).toBe('bottom');
        expect(options().style.maxHeight).toMatch(/px$/);
    });
});
