type Root = Document | HTMLElement;

const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusable(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
}

function trapFocus(dialog: HTMLElement, e: KeyboardEvent) {
    if (e.key !== 'Tab') return;

    const focusable = getFocusable(dialog);
    if (focusable.length === 0) {
        e.preventDefault();
        return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
        if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
        }
    } else {
        if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
}

function setupDialog(dialog: HTMLDialogElement) {
    if (dialog.hasAttribute('data-hui-dialog-initialized')) return;
    dialog.setAttribute('data-hui-dialog-initialized', '');

    let previouslyFocused: HTMLElement | null = null;

    function open() {
        if (dialog.open) return;

        previouslyFocused = document.activeElement as HTMLElement | null;
        dialog.showModal();
        dialog.setAttribute('data-hui-dialog-open', '');

        const focusable = getFocusable(dialog);
        if (focusable.length > 0) {
            focusable[0].focus();
        }

        dialog.dispatchEvent(new CustomEvent('hui:dialog:open', { bubbles: true }));
    }

    function close() {
        if (!dialog.open) return;

        dialog.close();
        dialog.removeAttribute('data-hui-dialog-open');

        if (previouslyFocused && previouslyFocused.focus) {
            previouslyFocused.focus();
        }
        previouslyFocused = null;

        dialog.dispatchEvent(new CustomEvent('hui:dialog:close', { bubbles: true }));
    }

    // Focus trap
    dialog.addEventListener('keydown', (e: KeyboardEvent) => {
        trapFocus(dialog, e);
    });

    // Close on Escape (native <dialog> handles this, but we need cleanup)
    dialog.addEventListener('cancel', (e) => {
        e.preventDefault();
        close();
    });

    // Close on overlay click (click on <dialog> itself, not on panel)
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            close();
        }
    });

    // Close buttons inside dialog
    dialog.addEventListener('click', (e) => {
        const target = (e.target as HTMLElement).closest<HTMLElement>('[data-hui-dialog-close]');
        if (target) {
            close();
        }
    });

    // ARIA: link title and description
    const title = dialog.querySelector<HTMLElement>('[data-hui-dialog-title]');
    const description = dialog.querySelector<HTMLElement>('[data-hui-dialog-description]');

    if (title) {
        if (!title.id) title.id = `hui-dialog-title-${uniqueId()}`;
        dialog.setAttribute('aria-labelledby', title.id);
    }

    if (description) {
        if (!description.id) description.id = `hui-dialog-desc-${uniqueId()}`;
        dialog.setAttribute('aria-describedby', description.id);
    }

    // Store open/close on the element for JS API access
    (dialog as any)._hui = { open, close };

    // Auto-open if data-hui-dialog-open was set in HTML
    if (dialog.hasAttribute('data-hui-dialog-open')) {
        // Remove and re-add to trigger proper open flow
        dialog.removeAttribute('data-hui-dialog-open');
        open();
    }
}

let _id = 0;
function uniqueId(): string {
    return `hui-${++_id}-${Date.now()}`;
}

function bindTriggers(root: Root) {
    const triggers = Array.from(root.querySelectorAll<HTMLElement>('[data-hui-dialog-trigger]'));

    triggers.forEach((trigger) => {
        if (trigger.hasAttribute('data-hui-dialog-trigger-bound')) return;
        trigger.setAttribute('data-hui-dialog-trigger-bound', '');

        trigger.addEventListener('click', () => {
            const targetId = trigger.getAttribute('data-hui-dialog-trigger');
            if (!targetId) return;

            const dialog = document.getElementById(targetId) as HTMLDialogElement | null;
            if (!dialog || !(dialog as any)._hui) return;

            (dialog as any)._hui.open();
        });
    });
}

// --- Public JS API ---

export function openDialog(id: string): void {
    const dialog = document.getElementById(id) as HTMLDialogElement | null;
    if (!dialog || !(dialog as any)._hui) return;
    (dialog as any)._hui.open();
}

export function closeDialog(id: string): void {
    const dialog = document.getElementById(id) as HTMLDialogElement | null;
    if (!dialog || !(dialog as any)._hui) return;
    (dialog as any)._hui.close();
}

// --- Registration ---

export function registerDialogs(root: Root = document) {
    const dialogs = Array.from(root.querySelectorAll<HTMLDialogElement>('[data-hui-dialog]'));
    dialogs.forEach(setupDialog);
    bindTriggers(root);
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => registerDialogs());
    } else {
        registerDialogs();
    }
}
