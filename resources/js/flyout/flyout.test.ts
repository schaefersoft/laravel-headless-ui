import { describe, it, expect, beforeEach } from 'vitest';
import { registerFlyouts, openFlyout, closeFlyout } from './flyout';

interface FlyoutOpts {
    position?: string;
    open?: boolean;
    noEscape?: boolean;
    noBackdropClose?: boolean;
    scrollLock?: boolean;
    inline?: number;
    swipe?: 'open' | 'close' | 'both';
}

function createFlyout(id: string, opts: FlyoutOpts = {}): HTMLDialogElement {
    const pos = opts.position || 'right';
    const attrs = [
        opts.open ? 'data-hui-flyout-open' : '',
        opts.noEscape ? 'data-hui-flyout-no-escape' : '',
        opts.noBackdropClose ? 'data-hui-flyout-no-backdrop-close' : '',
        opts.scrollLock ? 'data-hui-flyout-scroll-lock' : '',
        opts.inline ? `data-hui-flyout-inline="${opts.inline}"` : '',
        opts.swipe ? `data-hui-flyout-swipe="${opts.swipe}"` : '',
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

function dispatchTouch(el: EventTarget, type: string, x: number, y: number, ts = 0) {
    const e = new Event(type, { bubbles: true, cancelable: true });
    const point = { clientX: x, clientY: y };
    Object.defineProperty(e, 'timeStamp', { value: ts, configurable: true });
    (e as any).touches = (type === 'touchend' || type === 'touchcancel') ? [] : [point];
    (e as any).changedTouches = [point];
    el.dispatchEvent(e);
    return e;
}

function stubPanelSize(panel: HTMLElement, width: number, height: number) {
    panel.getBoundingClientRect = () => ({
        width, height, top: 0, left: 0, right: width, bottom: height, x: 0, y: 0,
        toJSON() {},
    }) as DOMRect;
}

const DEFAULT_INNER_WIDTH = window.innerWidth;

function setViewportWidth(width: number) {
    Object.defineProperty(window, 'innerWidth', { value: width, configurable: true, writable: true });
}

async function waitFor(cond: () => boolean, timeout = 800): Promise<void> {
    const start = Date.now();
    while (!cond()) {
        if (Date.now() - start > timeout) throw new Error('waitFor: condition not met in time');
        await new Promise((r) => setTimeout(r, 10));
    }
}

describe('Flyout', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        document.body.style.overflow = '';
        setViewportWidth(DEFAULT_INNER_WIDTH);
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

    // --- Swipe gestures ---

    it('closes when swiped past the threshold toward its edge', async () => {
        const flyout = createFlyout('test-flyout', { swipe: 'close' });
        openFlyout('test-flyout');
        const panel = flyout.querySelector<HTMLElement>('[data-hui-flyout-panel]')!;
        stubPanelSize(panel, 300, 600);

        dispatchTouch(panel, 'touchstart', 250, 300, 0);
        dispatchTouch(panel, 'touchmove', 430, 300, 1000);
        dispatchTouch(panel, 'touchend', 430, 300, 1000);

        await waitFor(() => flyout.open === false);
        expect(flyout.open).toBe(false);
    });

    it('snaps back and stays open when the swipe is too small', () => {
        const flyout = createFlyout('test-flyout', { swipe: 'close' });
        openFlyout('test-flyout');
        const panel = flyout.querySelector<HTMLElement>('[data-hui-flyout-panel]')!;
        stubPanelSize(panel, 300, 600);

        dispatchTouch(panel, 'touchstart', 250, 300, 0);
        dispatchTouch(panel, 'touchmove', 280, 300, 200);
        dispatchTouch(panel, 'touchend', 280, 300, 200);

        expect(flyout.open).toBe(true);
    });

    it('closes on a fast flick even below the distance threshold', async () => {
        const flyout = createFlyout('test-flyout', { swipe: 'close' });
        openFlyout('test-flyout');
        const panel = flyout.querySelector<HTMLElement>('[data-hui-flyout-panel]')!;
        stubPanelSize(panel, 300, 600);

        dispatchTouch(panel, 'touchstart', 250, 300, 0);
        dispatchTouch(panel, 'touchmove', 310, 300, 10);
        dispatchTouch(panel, 'touchend', 310, 300, 10);

        await waitFor(() => flyout.open === false);
        expect(flyout.open).toBe(false);
    });

    it('closes a left flyout when swiped left', async () => {
        const flyout = createFlyout('test-flyout', { position: 'left', swipe: 'close' });
        openFlyout('test-flyout');
        const panel = flyout.querySelector<HTMLElement>('[data-hui-flyout-panel]')!;
        stubPanelSize(panel, 300, 600);

        dispatchTouch(panel, 'touchstart', 250, 300, 0);
        dispatchTouch(panel, 'touchmove', 70, 300, 1000);
        dispatchTouch(panel, 'touchend', 70, 300, 1000);

        await waitFor(() => flyout.open === false);
        expect(flyout.open).toBe(false);
    });

    it('does not close on a cross-axis (scrolling) swipe', () => {
        const flyout = createFlyout('test-flyout', { swipe: 'close' });
        openFlyout('test-flyout');
        const panel = flyout.querySelector<HTMLElement>('[data-hui-flyout-panel]')!;
        stubPanelSize(panel, 300, 600);

        dispatchTouch(panel, 'touchstart', 250, 300, 0);
        dispatchTouch(panel, 'touchmove', 256, 500, 200);
        dispatchTouch(panel, 'touchend', 256, 500, 200);

        expect(flyout.open).toBe(true);
    });

    it('bottom sheet closes on swipe-down only when scrolled to the top', async () => {
        const flyout = createFlyout('test-flyout', { position: 'bottom', swipe: 'close' });
        openFlyout('test-flyout');
        const panel = flyout.querySelector<HTMLElement>('[data-hui-flyout-panel]')!;
        stubPanelSize(panel, 600, 400);

        Object.defineProperty(panel, 'scrollTop', { value: 50, configurable: true });
        dispatchTouch(panel, 'touchstart', 300, 100, 0);
        dispatchTouch(panel, 'touchmove', 300, 300, 1000);
        dispatchTouch(panel, 'touchend', 300, 300, 1000);
        expect(flyout.open).toBe(true);

        Object.defineProperty(panel, 'scrollTop', { value: 0, configurable: true });
        dispatchTouch(panel, 'touchstart', 300, 100, 2000);
        dispatchTouch(panel, 'touchmove', 300, 300, 3000);
        dispatchTouch(panel, 'touchend', 300, 300, 3000);
        await waitFor(() => flyout.open === false);
        expect(flyout.open).toBe(false);
    });

    it('opens on an edge swipe when swipe="open"', () => {
        const flyout = createFlyout('test-flyout', { swipe: 'open' });
        const w = window.innerWidth;

        dispatchTouch(document, 'touchstart', w - 5, 300, 0);
        dispatchTouch(document, 'touchmove', w - 80, 300, 100);

        expect(flyout.open).toBe(true);
    });

    it('does not open from an edge swipe when swipe="close"', () => {
        const flyout = createFlyout('test-flyout', { swipe: 'close' });
        const w = window.innerWidth;

        dispatchTouch(document, 'touchstart', w - 5, 300, 0);
        dispatchTouch(document, 'touchmove', w - 80, 300, 100);

        expect(flyout.open).toBe(false);
    });

    it('ignores swipes entirely when the swipe prop is absent', () => {
        const flyout = createFlyout('test-flyout');
        openFlyout('test-flyout');
        const panel = flyout.querySelector<HTMLElement>('[data-hui-flyout-panel]')!;
        stubPanelSize(panel, 300, 600);

        dispatchTouch(panel, 'touchstart', 250, 300, 0);
        dispatchTouch(panel, 'touchmove', 430, 300, 1000);
        dispatchTouch(panel, 'touchend', 430, 300, 1000);

        expect(flyout.open).toBe(true);
    });

    // --- Inline (sidebar) mode ---

    it('does not auto-open above the inline breakpoint (sidebar is shown via CSS)', () => {
        setViewportWidth(1280);
        const flyout = createFlyout('test-flyout', { open: true, inline: 1024 });
        expect(flyout.open).toBe(false);
        expect(flyout.hasAttribute('data-hui-flyout-open')).toBe(false);
    });

    it('ignores open() while above the inline breakpoint', () => {
        setViewportWidth(1280);
        const flyout = createFlyout('test-flyout', { inline: 1024 });
        openFlyout('test-flyout');
        expect(flyout.open).toBe(false);
    });

    it('behaves as a normal drawer below the inline breakpoint', () => {
        setViewportWidth(800);
        const flyout = createFlyout('test-flyout', { inline: 1024 });
        openFlyout('test-flyout');
        expect(flyout.open).toBe(true);
        closeFlyout('test-flyout');
        expect(flyout.open).toBe(false);
    });

    it('never sets a presentation mode attribute (inline styling is CSS-driven)', () => {
        setViewportWidth(1280);
        const inline = createFlyout('test-flyout', { inline: 1024 });
        expect(inline.hasAttribute('data-hui-flyout-mode')).toBe(false);

        setViewportWidth(800);
        const drawer = createFlyout('drawer-flyout', { inline: 1024 });
        expect(drawer.hasAttribute('data-hui-flyout-mode')).toBe(false);
    });
});
