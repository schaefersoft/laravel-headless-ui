import { describe, it, expect, beforeEach } from 'vitest';
import { registerFlyouts, openFlyout, closeFlyout } from './flyout';

interface FlyoutOpts {
    position?: string;
    open?: boolean;
    noEscape?: boolean;
    noBackdropClose?: boolean;
    scrollLock?: boolean;
    inline?: number;
}

function createFlyout(id: string, opts: FlyoutOpts = {}): HTMLDialogElement {
    const pos = opts.position || 'right';
    const attrs = [
        opts.open ? 'data-hui-flyout-open' : '',
        opts.noEscape ? 'data-hui-flyout-no-escape' : '',
        opts.noBackdropClose ? 'data-hui-flyout-no-backdrop-close' : '',
        opts.scrollLock ? 'data-hui-flyout-scroll-lock' : '',
        opts.inline ? `data-hui-flyout-inline="${opts.inline}"` : '',
    ].filter(Boolean).join(' ');

    document.body.innerHTML = `
        <button data-hui-flyout-trigger="${id}">Open</button>
        <dialog data-hui-flyout data-hui-flyout-position="${pos}" id="${id}" ${attrs}>
            <div data-hui-flyout-background aria-hidden="true"></div>
            <div data-hui-flyout-panel>
                <h2 data-hui-flyout-title>Title</h2>
                <p data-hui-flyout-description>Description</p>
                <button data-hui-flyout-close>Close</button>
                <input type="text" />
            </div>
        </dialog>
    `;
    registerFlyouts();
    return document.getElementById(id) as HTMLDialogElement;
}

describe('Flyout', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        document.body.style.overflow = '';
    });

    // --- Open / Close ---

    it('opens via trigger button click', () => {
        const flyout = createFlyout('test-flyout');
        const trigger = document.querySelector<HTMLElement>('[data-hui-flyout-trigger]')!;
        trigger.click();
        expect(flyout.open).toBe(true);
        expect(flyout.hasAttribute('data-hui-flyout-open')).toBe(true);
    });

    it('opens via JS API', () => {
        const flyout = createFlyout('test-flyout');
        openFlyout('test-flyout');
        expect(flyout.open).toBe(true);
    });

    it('closes via JS API', () => {
        const flyout = createFlyout('test-flyout');
        openFlyout('test-flyout');
        closeFlyout('test-flyout');
        expect(flyout.open).toBe(false);
    });

    it('closes via close button', () => {
        const flyout = createFlyout('test-flyout');
        openFlyout('test-flyout');
        const closeBtn = flyout.querySelector<HTMLElement>('[data-hui-flyout-close]')!;
        closeBtn.click();
        expect(flyout.open).toBe(false);
    });

    it('closes on Escape via cancel event', () => {
        const flyout = createFlyout('test-flyout');
        openFlyout('test-flyout');
        flyout.dispatchEvent(new Event('cancel', { cancelable: true }));
        expect(flyout.open).toBe(false);
    });

    it('closes on backdrop click', () => {
        const flyout = createFlyout('test-flyout');
        openFlyout('test-flyout');
        flyout.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(flyout.open).toBe(false);
    });

    it('does not close when clicking inside panel', () => {
        const flyout = createFlyout('test-flyout');
        openFlyout('test-flyout');
        const panel = flyout.querySelector('[data-hui-flyout-panel]')!;
        panel.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(flyout.open).toBe(true);
    });

    // --- Options ---

    it('does not close on Escape when noEscape is set', () => {
        const flyout = createFlyout('test-flyout', { noEscape: true });
        openFlyout('test-flyout');
        flyout.dispatchEvent(new Event('cancel', { cancelable: true }));
        expect(flyout.open).toBe(true);
    });

    it('does not close on backdrop click when noBackdropClose is set', () => {
        const flyout = createFlyout('test-flyout', { noBackdropClose: true });
        openFlyout('test-flyout');
        flyout.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(flyout.open).toBe(true);
    });

    it('locks scroll on open when scrollLock is set', () => {
        createFlyout('test-flyout', { scrollLock: true });
        openFlyout('test-flyout');
        expect(document.body.style.overflow).toBe('hidden');
        closeFlyout('test-flyout');
        expect(document.body.style.overflow).toBe('');
    });

    // --- ARIA ---

    it('sets aria-labelledby from title', () => {
        const flyout = createFlyout('test-flyout');
        const title = flyout.querySelector('[data-hui-flyout-title]')!;
        expect(flyout.getAttribute('aria-labelledby')).toBe(title.id);
    });

    it('sets aria-describedby from description', () => {
        const flyout = createFlyout('test-flyout');
        const desc = flyout.querySelector('[data-hui-flyout-description]')!;
        expect(flyout.getAttribute('aria-describedby')).toBe(desc.id);
    });

    // --- Position ---

    it('stores position as data attribute', () => {
        const flyout = createFlyout('test-flyout', { position: 'left' });
        expect(flyout.getAttribute('data-hui-flyout-position')).toBe('left');
    });

    it('defaults to right position', () => {
        const flyout = createFlyout('test-flyout');
        expect(flyout.getAttribute('data-hui-flyout-position')).toBe('right');
    });

    // --- Focus ---

    it('restores focus on close', () => {
        const flyout = createFlyout('test-flyout');
        const trigger = document.querySelector<HTMLElement>('[data-hui-flyout-trigger]')!;
        trigger.focus();
        trigger.click();
        expect(flyout.open).toBe(true);
        closeFlyout('test-flyout');
        expect(document.activeElement).toBe(trigger);
    });

    // --- Events ---

    it('dispatches open and close events', () => {
        const flyout = createFlyout('test-flyout');
        let opened = false;
        let closed = false;
        flyout.addEventListener('hui:flyout:open', () => { opened = true; });
        flyout.addEventListener('hui:flyout:close', () => { closed = true; });
        openFlyout('test-flyout');
        expect(opened).toBe(true);
        closeFlyout('test-flyout');
        expect(closed).toBe(true);
    });

    // --- Auto-open ---

    it('auto-opens when data-hui-flyout-open is set', () => {
        const flyout = createFlyout('test-flyout', { open: true });
        expect(flyout.open).toBe(true);
    });

    // --- Idempotent ---

    it('does nothing when opening already open flyout', () => {
        const flyout = createFlyout('test-flyout');
        let count = 0;
        flyout.addEventListener('hui:flyout:open', () => { count++; });
        openFlyout('test-flyout');
        openFlyout('test-flyout');
        expect(count).toBe(1);
    });

    it('does nothing when closing already closed flyout', () => {
        const flyout = createFlyout('test-flyout');
        let count = 0;
        flyout.addEventListener('hui:flyout:close', () => { count++; });
        closeFlyout('test-flyout');
        expect(count).toBe(0);
    });

    it('ignores JS API for non-existent flyout', () => {
        createFlyout('test-flyout');
        openFlyout('non-existent');
        closeFlyout('non-existent');
    });
});
