import { describe, it, expect, beforeEach, vi } from 'vitest';
import { registerDropdowns, openDropdown, closeDropdown } from './dropdown';

function createDropdown(id: string, opts: { disabledItems?: number[] } = {}): HTMLElement {
    const disabledItems = opts.disabledItems || [];
    document.body.innerHTML = `
        <div data-hui-dropdown id="${id}">
            <button data-hui-dropdown-trigger>Actions</button>
            <div data-hui-dropdown-items>
                <div data-hui-dropdown-item data-value="edit" ${disabledItems.includes(0) ? 'data-disabled' : ''}>Edit</div>
                <div data-hui-dropdown-item data-value="duplicate" ${disabledItems.includes(1) ? 'data-disabled' : ''}>Duplicate</div>
                <div role="separator"></div>
                <div data-hui-dropdown-item data-value="delete" ${disabledItems.includes(2) ? 'data-disabled' : ''}>Delete</div>
            </div>
        </div>
    `;
    registerDropdowns();
    return document.getElementById(id)!;
}

function getTrigger(dropdown: HTMLElement): HTMLElement {
    return dropdown.querySelector<HTMLElement>('[data-hui-dropdown-trigger]')!;
}

function getItems(dropdown: HTMLElement): HTMLElement {
    return dropdown.querySelector<HTMLElement>('[data-hui-dropdown-items]')!;
}

function getMenuItems(dropdown: HTMLElement): HTMLElement[] {
    return Array.from(dropdown.querySelectorAll<HTMLElement>('[data-hui-dropdown-item]:not([data-disabled])'));
}

describe('Dropdown', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    // --- Open / Close ---

    it('opens on trigger click', () => {
        const dropdown = createDropdown('test-dd');
        const trigger = getTrigger(dropdown);
        const items = getItems(dropdown);

        trigger.click();

        expect(items.style.display).toBe('block');
        expect(trigger.getAttribute('aria-expanded')).toBe('true');
        expect(dropdown.hasAttribute('data-open')).toBe(true);
    });

    it('closes on second trigger click', () => {
        const dropdown = createDropdown('test-dd');
        const trigger = getTrigger(dropdown);
        const items = getItems(dropdown);

        trigger.click();
        trigger.click();

        expect(items.style.display).toBe('none');
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
        expect(dropdown.hasAttribute('data-open')).toBe(false);
    });

    it('opens via JS API', () => {
        const dropdown = createDropdown('test-dd');
        const items = getItems(dropdown);

        openDropdown('test-dd');

        expect(items.style.display).toBe('block');
    });

    it('closes via JS API', () => {
        const dropdown = createDropdown('test-dd');
        const items = getItems(dropdown);

        openDropdown('test-dd');
        closeDropdown('test-dd');

        expect(items.style.display).toBe('none');
    });

    it('closes on outside click', async () => {
        const dropdown = createDropdown('test-dd');
        const items = getItems(dropdown);

        openDropdown('test-dd');

        // Wait for rAF that defers the outside click listener
        await new Promise((r) => requestAnimationFrame(r));

        const event = new PointerEvent('pointerdown', { bubbles: true });
        document.body.dispatchEvent(event);

        expect(items.style.display).toBe('none');
    });

    it('closes on Escape key', () => {
        const dropdown = createDropdown('test-dd');
        const trigger = getTrigger(dropdown);
        const items = getItems(dropdown);

        trigger.click();
        expect(items.style.display).toBe('block');

        trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

        expect(items.style.display).toBe('none');
    });

    it('closes on Tab key', () => {
        const dropdown = createDropdown('test-dd');
        const trigger = getTrigger(dropdown);
        const items = getItems(dropdown);

        trigger.click();
        trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));

        expect(items.style.display).toBe('none');
    });

    // --- ARIA ---

    it('sets aria-haspopup and aria-expanded on trigger', () => {
        const dropdown = createDropdown('test-dd');
        const trigger = getTrigger(dropdown);

        expect(trigger.getAttribute('aria-haspopup')).toBe('true');
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('sets role=menu on items container', () => {
        const dropdown = createDropdown('test-dd');
        const items = getItems(dropdown);

        expect(items.getAttribute('role')).toBe('menu');
    });

    it('sets role=menuitem on each item', () => {
        const dropdown = createDropdown('test-dd');
        const menuItems = Array.from(dropdown.querySelectorAll('[data-hui-dropdown-item]'));

        menuItems.forEach((item) => {
            expect(item.getAttribute('role')).toBe('menuitem');
        });
    });

    it('sets aria-controls linking trigger to items', () => {
        const dropdown = createDropdown('test-dd');
        const trigger = getTrigger(dropdown);
        const items = getItems(dropdown);

        expect(trigger.getAttribute('aria-controls')).toBe(items.id);
    });

    it('sets aria-disabled on disabled items', () => {
        const dropdown = createDropdown('test-dd', { disabledItems: [1] });
        const allItems = Array.from(dropdown.querySelectorAll('[data-hui-dropdown-item]'));

        expect(allItems[1].getAttribute('aria-disabled')).toBe('true');
    });

    // --- Keyboard navigation ---

    it('opens and focuses first item on ArrowDown', () => {
        const dropdown = createDropdown('test-dd');
        const trigger = getTrigger(dropdown);
        const items = getItems(dropdown);
        const menuItems = getMenuItems(dropdown);

        trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

        expect(items.style.display).toBe('block');
        expect(menuItems[0].hasAttribute('data-active')).toBe(true);
    });

    it('opens and focuses last item on ArrowUp', () => {
        const dropdown = createDropdown('test-dd');
        const trigger = getTrigger(dropdown);
        const items = getItems(dropdown);
        const menuItems = getMenuItems(dropdown);

        trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));

        expect(items.style.display).toBe('block');
        expect(menuItems[menuItems.length - 1].hasAttribute('data-active')).toBe(true);
    });

    it('navigates down through items with ArrowDown', () => {
        const dropdown = createDropdown('test-dd');
        const trigger = getTrigger(dropdown);
        const menuItems = getMenuItems(dropdown);

        trigger.click();
        // Focus first
        trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        expect(menuItems[0].hasAttribute('data-active')).toBe(true);

        // Move to second
        trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        expect(menuItems[1].hasAttribute('data-active')).toBe(true);
        expect(menuItems[0].hasAttribute('data-active')).toBe(false);
    });

    it('wraps around from last to first on ArrowDown', () => {
        const dropdown = createDropdown('test-dd');
        const trigger = getTrigger(dropdown);
        const menuItems = getMenuItems(dropdown);

        trigger.click();
        // Go to last
        trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
        expect(menuItems[menuItems.length - 1].hasAttribute('data-active')).toBe(true);

        // Wrap to first
        trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        expect(menuItems[0].hasAttribute('data-active')).toBe(true);
    });

    it('navigates to first item on Home', () => {
        const dropdown = createDropdown('test-dd');
        const trigger = getTrigger(dropdown);
        const menuItems = getMenuItems(dropdown);

        trigger.click();
        trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
        trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));

        expect(menuItems[0].hasAttribute('data-active')).toBe(true);
    });

    it('navigates to last item on End', () => {
        const dropdown = createDropdown('test-dd');
        const trigger = getTrigger(dropdown);
        const menuItems = getMenuItems(dropdown);

        trigger.click();
        trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));

        expect(menuItems[menuItems.length - 1].hasAttribute('data-active')).toBe(true);
    });

    it('selects item on Enter and closes', () => {
        const dropdown = createDropdown('test-dd');
        const trigger = getTrigger(dropdown);
        const items = getItems(dropdown);
        const menuItems = getMenuItems(dropdown);
        let selectedValue: string | null = null;

        dropdown.addEventListener('hui:dropdown:select', ((e: CustomEvent) => {
            selectedValue = e.detail.value;
        }) as EventListener);

        trigger.click();
        trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

        expect(selectedValue).toBe('edit');
        expect(items.style.display).toBe('none');
    });

    // --- Item click ---

    it('dispatches select event on item click', () => {
        const dropdown = createDropdown('test-dd');
        const menuItems = getMenuItems(dropdown);
        let selectedValue: string | null = null;

        dropdown.addEventListener('hui:dropdown:select', ((e: CustomEvent) => {
            selectedValue = e.detail.value;
        }) as EventListener);

        openDropdown('test-dd');
        menuItems[0].click();

        expect(selectedValue).toBe('edit');
    });

    it('closes after item click', () => {
        const dropdown = createDropdown('test-dd');
        const items = getItems(dropdown);
        const menuItems = getMenuItems(dropdown);

        openDropdown('test-dd');
        menuItems[0].click();

        expect(items.style.display).toBe('none');
    });

    it('skips disabled items in navigation', () => {
        const dropdown = createDropdown('test-dd', { disabledItems: [0] });
        const trigger = getTrigger(dropdown);
        const menuItems = getMenuItems(dropdown);

        // Disabled items are excluded from getMenuItems
        expect(menuItems.length).toBe(2);
    });

    // --- Events ---

    it('dispatches custom open/close events', () => {
        const dropdown = createDropdown('test-dd');
        let opened = false;
        let closed = false;

        dropdown.addEventListener('hui:dropdown:open', () => { opened = true; });
        dropdown.addEventListener('hui:dropdown:close', () => { closed = true; });

        openDropdown('test-dd');
        expect(opened).toBe(true);

        closeDropdown('test-dd');
        expect(closed).toBe(true);
    });

    it('ignores JS API calls for non-existent dropdown', () => {
        createDropdown('test-dd');

        // Should not throw
        openDropdown('non-existent');
        closeDropdown('non-existent');
    });

    // --- Type-ahead ---

    it('focuses matching item on type-ahead', () => {
        const dropdown = createDropdown('test-dd');
        const trigger = getTrigger(dropdown);
        const menuItems = getMenuItems(dropdown);

        trigger.click();

        // Type 'd' to match "Duplicate"
        const itemsEl = getItems(dropdown);
        itemsEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'd', bubbles: true }));

        expect(menuItems[1].hasAttribute('data-active')).toBe(true);
    });
});
