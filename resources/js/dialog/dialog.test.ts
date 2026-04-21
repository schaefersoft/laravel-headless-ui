import { describe, it, expect, beforeEach } from 'vitest';
import { registerDialogs, openDialog, closeDialog } from './dialog';

interface DialogOpts {
    open?: boolean;
    noEscape?: boolean;
    noBackdropClose?: boolean;
    scrollLock?: boolean;
}

function createDialog(id: string, opts: DialogOpts = {}): HTMLDialogElement {
    const attrs = [
        opts.open ? 'data-hui-dialog-open' : '',
        opts.noEscape ? 'data-hui-dialog-no-escape' : '',
        opts.noBackdropClose ? 'data-hui-dialog-no-backdrop-close' : '',
        opts.scrollLock ? 'data-hui-dialog-scroll-lock' : '',
    ].filter(Boolean).join(' ');

    document.body.innerHTML = `
        <button data-hui-dialog-trigger="${id}">Open</button>
        <dialog data-hui-dialog id="${id}" ${attrs}>
            <div data-hui-dialog-overlay aria-hidden="true"></div>
            <div data-hui-dialog-panel>
                <h2 data-hui-dialog-title>Title</h2>
                <p data-hui-dialog-description>Description</p>
                <button data-hui-dialog-close>Close</button>
                <input type="text" />
            </div>
        </dialog>
    `;
    registerDialogs();
    return document.getElementById(id) as HTMLDialogElement;
}

describe('Dialog', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('opens via trigger button click', () => {
        const dialog = createDialog('test-dialog');
        const trigger = document.querySelector<HTMLElement>('[data-hui-dialog-trigger]')!;

        trigger.click();

        expect(dialog.open).toBe(true);
        expect(dialog.hasAttribute('data-hui-dialog-open')).toBe(true);
    });

    it('closes via close button click', () => {
        const dialog = createDialog('test-dialog');

        openDialog('test-dialog');
        expect(dialog.open).toBe(true);

        const closeBtn = dialog.querySelector<HTMLElement>('[data-hui-dialog-close]')!;
        closeBtn.click();

        expect(dialog.open).toBe(false);
        expect(dialog.hasAttribute('data-hui-dialog-open')).toBe(false);
    });

    it('opens via JS API', () => {
        const dialog = createDialog('test-dialog');

        openDialog('test-dialog');

        expect(dialog.open).toBe(true);
    });

    it('closes via JS API', () => {
        const dialog = createDialog('test-dialog');

        openDialog('test-dialog');
        closeDialog('test-dialog');

        expect(dialog.open).toBe(false);
    });

    it('sets aria-labelledby from title', () => {
        const dialog = createDialog('test-dialog');
        const title = dialog.querySelector('[data-hui-dialog-title]')!;

        expect(dialog.getAttribute('aria-labelledby')).toBe(title.id);
    });

    it('sets aria-describedby from description', () => {
        const dialog = createDialog('test-dialog');
        const desc = dialog.querySelector('[data-hui-dialog-description]')!;

        expect(dialog.getAttribute('aria-describedby')).toBe(desc.id);
    });

    it('closes on Escape via cancel event', () => {
        const dialog = createDialog('test-dialog');

        openDialog('test-dialog');
        expect(dialog.open).toBe(true);

        const cancelEvent = new Event('cancel', { cancelable: true });
        dialog.dispatchEvent(cancelEvent);

        expect(dialog.open).toBe(false);
    });

    it('closes when clicking the dialog backdrop (dialog element itself)', () => {
        const dialog = createDialog('test-dialog');

        openDialog('test-dialog');
        expect(dialog.open).toBe(true);

        // Simulate click on dialog element itself (not on panel)
        dialog.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(dialog.open).toBe(false);
    });

    it('does not close when clicking inside panel', () => {
        const dialog = createDialog('test-dialog');

        openDialog('test-dialog');

        const panel = dialog.querySelector('[data-hui-dialog-panel]')!;
        panel.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(dialog.open).toBe(true);
    });

    it('restores focus to previously focused element on close', () => {
        const dialog = createDialog('test-dialog');
        const trigger = document.querySelector<HTMLElement>('[data-hui-dialog-trigger]')!;

        trigger.focus();
        trigger.click();
        expect(dialog.open).toBe(true);

        closeDialog('test-dialog');
        expect(document.activeElement).toBe(trigger);
    });

    it('auto-opens when data-hui-dialog-open is set', () => {
        const dialog = createDialog('test-dialog', { open: true });

        expect(dialog.open).toBe(true);
    });

    it('dispatches custom events on open and close', () => {
        const dialog = createDialog('test-dialog');
        let opened = false;
        let closed = false;

        dialog.addEventListener('hui:dialog:open', () => { opened = true; });
        dialog.addEventListener('hui:dialog:close', () => { closed = true; });

        openDialog('test-dialog');
        expect(opened).toBe(true);

        closeDialog('test-dialog');
        expect(closed).toBe(true);
    });

    it('does nothing when opening an already open dialog', () => {
        const dialog = createDialog('test-dialog');
        let openCount = 0;

        dialog.addEventListener('hui:dialog:open', () => { openCount++; });

        openDialog('test-dialog');
        openDialog('test-dialog');

        expect(openCount).toBe(1);
    });

    it('does nothing when closing an already closed dialog', () => {
        const dialog = createDialog('test-dialog');
        let closeCount = 0;

        dialog.addEventListener('hui:dialog:close', () => { closeCount++; });

        closeDialog('test-dialog');

        expect(closeCount).toBe(0);
    });

    it('ignores JS API calls for non-existent dialog', () => {
        createDialog('test-dialog');

        // Should not throw
        openDialog('non-existent');
        closeDialog('non-existent');
    });

    it('does not close on Escape when data-hui-dialog-no-escape is set', () => {
        const dialog = createDialog('test-dialog', { noEscape: true });

        openDialog('test-dialog');
        expect(dialog.open).toBe(true);

        const cancelEvent = new Event('cancel', { cancelable: true });
        dialog.dispatchEvent(cancelEvent);

        expect(dialog.open).toBe(true);
    });

    it('does not close on backdrop click when data-hui-dialog-no-backdrop-close is set', () => {
        const dialog = createDialog('test-dialog', { noBackdropClose: true });

        openDialog('test-dialog');
        expect(dialog.open).toBe(true);

        dialog.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(dialog.open).toBe(true);
    });

    it('still closes via close button when escape and backdrop are disabled', () => {
        const dialog = createDialog('test-dialog', { noEscape: true, noBackdropClose: true });

        openDialog('test-dialog');
        expect(dialog.open).toBe(true);

        const closeBtn = dialog.querySelector<HTMLElement>('[data-hui-dialog-close]')!;
        closeBtn.click();

        expect(dialog.open).toBe(false);
    });

    it('locks body scroll on open when data-hui-dialog-scroll-lock is set', () => {
        const dialog = createDialog('test-dialog', { scrollLock: true });

        openDialog('test-dialog');
        expect(document.body.style.overflow).toBe('hidden');

        closeDialog('test-dialog');
        expect(document.body.style.overflow).toBe('');
    });

    it('does not lock body scroll without scroll-lock attribute', () => {
        createDialog('test-dialog');

        openDialog('test-dialog');
        expect(document.body.style.overflow).not.toBe('hidden');

        closeDialog('test-dialog');
    });
});
