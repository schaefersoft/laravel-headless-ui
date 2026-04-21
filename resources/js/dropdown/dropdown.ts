type Root = Document | HTMLElement;

const FOCUSABLE_ITEM = '[data-hui-dropdown-item]:not([data-disabled])';

// --- Positioning ---

function positionItems(trigger: HTMLElement, items: HTMLElement) {
    const gap = 4;
    const viewportPadding = 8;
    const triggerRect = trigger.getBoundingClientRect();
    const { innerHeight: vh } = window;

    // Reset max-height before measuring natural height
    items.style.maxHeight = '';

    // Measure items natural height
    // Must remove `hidden` attr temporarily — it overrides display with !important
    const hadHidden = items.hasAttribute('hidden');
    if (hadHidden) items.removeAttribute('hidden');
    const prevVisibility = items.style.visibility;
    const prevDisplay = items.style.display;
    items.style.visibility = 'hidden';
    items.style.display = 'block';
    const ih = items.getBoundingClientRect().height;
    items.style.visibility = prevVisibility;
    items.style.display = prevDisplay;
    if (hadHidden) items.setAttribute('hidden', '');

    const spaceBelow = vh - triggerRect.bottom - gap - viewportPadding;
    const spaceAbove = triggerRect.top - gap - viewportPadding;

    let placement: string;

    if (spaceBelow >= ih) {
        // Fits below — use it
        placement = 'bottom';
    } else if (spaceAbove >= ih) {
        // Fits above — flip
        placement = 'top';
    } else {
        // Doesn't fit either way — pick the side with more room and constrain
        placement = spaceBelow >= spaceAbove ? 'bottom' : 'top';
    }

    if (placement === 'bottom') {
        items.style.top = `calc(100% + ${gap}px)`;
        items.style.bottom = '';
        if (spaceBelow < ih) {
            items.style.maxHeight = `${Math.floor(spaceBelow)}px`;
        }
    } else {
        items.style.bottom = `calc(100% + ${gap}px)`;
        items.style.top = '';
        if (spaceAbove < ih) {
            items.style.maxHeight = `${Math.floor(spaceAbove)}px`;
        }
    }

    items.setAttribute('data-placement', placement);
}

// --- Transition helpers (same pattern as dialog) ---

function getTransitionClasses(el: HTMLElement, prefix: string): { base: string[]; from: string[]; to: string[] } {
    const base = (el.getAttribute(prefix) || '').split(/\s+/).filter(Boolean);
    const from = (el.getAttribute(`${prefix}-from`) || '').split(/\s+/).filter(Boolean);
    const to = (el.getAttribute(`${prefix}-to`) || '').split(/\s+/).filter(Boolean);
    return { base, from, to };
}

function hasTransition(el: HTMLElement, prefix: string): boolean {
    return el.hasAttribute(prefix) || el.hasAttribute(`${prefix}-from`) || el.hasAttribute(`${prefix}-to`);
}

function nextFrame(): Promise<void> {
    return new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
}

function afterTransition(el: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
        const styles = getComputedStyle(el);
        const duration = parseFloat(styles.transitionDuration || '0');
        const delay = parseFloat(styles.transitionDelay || '0');
        const total = (duration + delay) * 1000;

        if (total <= 0) {
            resolve();
            return;
        }

        let done = false;
        const finish = () => {
            if (done) return;
            done = true;
            el.removeEventListener('transitionend', finish);
            resolve();
        };

        el.addEventListener('transitionend', finish, { once: true });
        setTimeout(finish, total + 50);
    });
}

function runEnterTransition(el: HTMLElement): Promise<void> {
    if (!hasTransition(el, 'data-hui-dropdown-enter')) return Promise.resolve();
    const { base, from, to } = getTransitionClasses(el, 'data-hui-dropdown-enter');
    if (base.length === 0 && from.length === 0 && to.length === 0) return Promise.resolve();

    el.classList.add(...base, ...from);
    return nextFrame().then(() => {
        el.classList.remove(...from);
        el.classList.add(...to);
        return afterTransition(el);
    }).then(() => {
        el.classList.remove(...base, ...to);
    });
}

function runLeaveTransition(el: HTMLElement): Promise<void> {
    if (!hasTransition(el, 'data-hui-dropdown-leave')) return Promise.resolve();
    const { base, from, to } = getTransitionClasses(el, 'data-hui-dropdown-leave');
    if (base.length === 0 && from.length === 0 && to.length === 0) return Promise.resolve();

    el.classList.add(...base, ...from);
    return nextFrame().then(() => {
        el.classList.remove(...from);
        el.classList.add(...to);
        return afterTransition(el);
    }).then(() => {
        el.classList.remove(...base, ...to);
    });
}

// --- Dropdown setup ---

function setupDropdown(dropdown: HTMLElement) {
    if (dropdown.hasAttribute('data-hui-dropdown-initialized')) return;
    dropdown.setAttribute('data-hui-dropdown-initialized', '');

    const trigger = dropdown.querySelector<HTMLElement>('[data-hui-dropdown-trigger]');
    const items = dropdown.querySelector<HTMLElement>('[data-hui-dropdown-items]');
    if (!trigger || !items) return;

    let isOpen = false;
    let isTransitioning = false;
    let activeIndex = -1;
    let typeAheadBuffer = '';
    let typeAheadTimer: ReturnType<typeof setTimeout> | null = null;

    function getItems(): HTMLElement[] {
        return Array.from(items!.querySelectorAll<HTMLElement>(FOCUSABLE_ITEM));
    }

    function setActiveItem(index: number) {
        const menuItems = getItems();
        // Remove active from all
        menuItems.forEach((item, i) => {
            if (i === index) {
                item.setAttribute('data-active', '');
                item.setAttribute('tabindex', '0');
                item.focus();
            } else {
                item.removeAttribute('data-active');
                item.setAttribute('tabindex', '-1');
            }
        });
        activeIndex = index;
    }

    function clearActive() {
        const menuItems = getItems();
        menuItems.forEach((item) => {
            item.removeAttribute('data-active');
            item.setAttribute('tabindex', '-1');
        });
        activeIndex = -1;
    }

    function open(focusFirst = false) {
        if (isOpen || isTransitioning) return;
        isOpen = true;

        positionItems(trigger!, items!);
        items!.style.display = 'block';
        items!.removeAttribute('hidden');
        trigger!.setAttribute('aria-expanded', 'true');
        dropdown.setAttribute('data-open', '');

        if (focusFirst) {
            const menuItems = getItems();
            if (menuItems.length > 0) {
                setActiveItem(0);
            }
        }

        runEnterTransition(items!);

        // Defer outside click listener to avoid catching the opening click
        requestAnimationFrame(() => {
            document.addEventListener('pointerdown', onOutsideClick, true);
        });

        dropdown.dispatchEvent(new CustomEvent('hui:dropdown:open', { bubbles: true }));
    }

    function close(restoreFocus = true) {
        if (!isOpen || isTransitioning) return;

        function finishClose() {
            isOpen = false;
            isTransitioning = false;
            items!.style.display = 'none';
            items!.setAttribute('hidden', '');
            trigger!.setAttribute('aria-expanded', 'false');
            dropdown.removeAttribute('data-open');
            clearActive();

            document.removeEventListener('pointerdown', onOutsideClick, true);

            if (restoreFocus) {
                trigger!.focus();
            }

            dropdown.dispatchEvent(new CustomEvent('hui:dropdown:close', { bubbles: true }));
        }

        if (hasTransition(items!, 'data-hui-dropdown-leave')) {
            isTransitioning = true;
            runLeaveTransition(items!).then(finishClose);
        } else {
            finishClose();
        }
    }

    function toggle() {
        if (isOpen) {
            close();
        } else {
            open();
        }
    }

    function onOutsideClick(e: PointerEvent) {
        if (!dropdown.contains(e.target as Node)) {
            close(false);
        }
    }

    // --- Type-ahead search ---

    function typeAhead(char: string) {
        typeAheadBuffer += char.toLowerCase();
        if (typeAheadTimer) clearTimeout(typeAheadTimer);
        typeAheadTimer = setTimeout(() => {
            typeAheadBuffer = '';
        }, 350);

        const menuItems = getItems();
        const match = menuItems.findIndex((item) => {
            const text = (item.textContent || '').trim().toLowerCase();
            return text.startsWith(typeAheadBuffer);
        });

        if (match !== -1) {
            setActiveItem(match);
        }
    }

    // --- Keyboard handling ---

    function onKeydown(e: KeyboardEvent) {
        const menuItems = getItems();
        if (menuItems.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (!isOpen) {
                    open(true);
                } else {
                    const next = activeIndex < menuItems.length - 1 ? activeIndex + 1 : 0;
                    setActiveItem(next);
                }
                break;

            case 'ArrowUp':
                e.preventDefault();
                if (!isOpen) {
                    open();
                    setActiveItem(menuItems.length - 1);
                } else {
                    const prev = activeIndex > 0 ? activeIndex - 1 : menuItems.length - 1;
                    setActiveItem(prev);
                }
                break;

            case 'Home':
                if (isOpen) {
                    e.preventDefault();
                    setActiveItem(0);
                }
                break;

            case 'End':
                if (isOpen) {
                    e.preventDefault();
                    setActiveItem(menuItems.length - 1);
                }
                break;

            case 'Enter':
            case ' ':
                e.preventDefault();
                if (isOpen && activeIndex >= 0 && activeIndex < menuItems.length) {
                    menuItems[activeIndex].click();
                    close();
                } else if (!isOpen) {
                    open(true);
                }
                break;

            case 'Escape':
                if (isOpen) {
                    e.preventDefault();
                    close();
                }
                break;

            case 'Tab':
                if (isOpen) {
                    close();
                }
                break;

            default:
                if (isOpen && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                    e.preventDefault();
                    typeAhead(e.key);
                }
                break;
        }
    }

    // --- ARIA setup ---

    let menuId = items.id;
    if (!menuId) {
        menuId = `hui-dropdown-items-${++_id}-${Date.now()}`;
        items.id = menuId;
    }

    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', menuId);
    items.setAttribute('role', 'menu');
    items.style.display = 'none';
    items.setAttribute('hidden', '');

    // Set up menu items
    const menuItems = getItems();
    menuItems.forEach((item) => {
        if (!item.getAttribute('role')) {
            item.setAttribute('role', 'menuitem');
        }
        item.setAttribute('tabindex', '-1');
    });

    // Also set role on disabled items
    const allItems = Array.from(items.querySelectorAll<HTMLElement>('[data-hui-dropdown-item]'));
    allItems.forEach((item) => {
        if (!item.getAttribute('role')) {
            item.setAttribute('role', 'menuitem');
        }
        if (item.hasAttribute('data-disabled')) {
            item.setAttribute('aria-disabled', 'true');
        }
    });

    // --- Event listeners ---

    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        toggle();
    });

    trigger.addEventListener('keydown', onKeydown);
    items.addEventListener('keydown', onKeydown);

    // Item click
    items.addEventListener('click', (e) => {
        const target = (e.target as HTMLElement).closest<HTMLElement>(FOCUSABLE_ITEM);
        if (target) {
            target.dispatchEvent(new CustomEvent('hui:dropdown:select', {
                bubbles: true,
                detail: { value: target.getAttribute('data-value') || target.textContent?.trim() },
            }));
            close();
        }
    });

    // Hover to highlight
    items.addEventListener('pointerenter', (e) => {
        const target = (e.target as HTMLElement).closest<HTMLElement>(FOCUSABLE_ITEM);
        if (target) {
            const menuItems = getItems();
            const index = menuItems.indexOf(target);
            if (index !== -1) {
                setActiveItem(index);
            }
        }
    }, true);

    items.addEventListener('pointerleave', (e) => {
        const target = (e.target as HTMLElement).closest<HTMLElement>(FOCUSABLE_ITEM);
        if (target) {
            clearActive();
        }
    }, true);

    // Store API
    (dropdown as any)._hui = { open, close, toggle };
}

let _id = 0;

// --- Public JS API ---

export function openDropdown(id: string): void {
    const dropdown = document.getElementById(id) as HTMLElement | null;
    if (!dropdown || !(dropdown as any)._hui) return;
    (dropdown as any)._hui.open(true);
}

export function closeDropdown(id: string): void {
    const dropdown = document.getElementById(id) as HTMLElement | null;
    if (!dropdown || !(dropdown as any)._hui) return;
    (dropdown as any)._hui.close();
}

// --- Registration ---

export function registerDropdowns(root: Root = document) {
    const dropdowns = Array.from(root.querySelectorAll<HTMLElement>('[data-hui-dropdown]'));
    dropdowns.forEach(setupDropdown);
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => registerDropdowns());
    } else {
        registerDropdowns();
    }
}
