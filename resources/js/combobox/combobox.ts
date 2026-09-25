type Root = Document | HTMLElement;

type Side = 'top' | 'bottom';
type Align = 'start' | 'end' | 'center';

const VIEWPORT_PADDING = 8;
const OPTION = '[data-hui-combobox-option]';

let _id = 0;

function uid(part: string): string {
    return `hui-combobox-${part}-${++_id}`;
}

function clamp(n: number, min: number, max: number): number {
    return Math.min(Math.max(n, min), max);
}

function normalize(text: string): string {
    return text.toLocaleLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// --- Positioning ---

function parseAnchor(value: string | null): { side: Side; align: Align } {
    const [side, align] = (value || 'bottom start').trim().toLowerCase().split(/\s+/);
    return {
        side: side === 'top' ? 'top' : 'bottom',
        align: align === 'start' || align === 'end' ? align : 'center',
    };
}

function getViewportBounds() {
    const vv = window.visualViewport;
    if (vv && vv.width > 0 && vv.height > 0) {
        return { top: vv.offsetTop, left: vv.offsetLeft, right: vv.offsetLeft + vv.width, bottom: vv.offsetTop + vv.height };
    }
    return { top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight };
}

// Transformed/filtered ancestors become the containing block of fixed elements.
// A zero-size fixed probe next to the options reveals that block's origin.
function containingBlockOrigin(options: HTMLElement): { x: number; y: number } {
    const parent = options.parentElement;
    if (!parent) return { x: 0, y: 0 };

    let probe = Array.from(parent.children).find((el) => el.hasAttribute('data-hui-combobox-probe')) as HTMLElement | undefined;
    if (!probe) {
        probe = document.createElement('span');
        probe.setAttribute('data-hui-combobox-probe', '');
        probe.setAttribute('aria-hidden', 'true');
        probe.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;';
        parent.insertBefore(probe, options);
    }

    const rect = probe.getBoundingClientRect();
    return { x: rect.left, y: rect.top };
}

export function positionOptions(reference: HTMLElement, options: HTMLElement): void {
    const { side: preferred, align } = parseAnchor(options.getAttribute('data-hui-combobox-anchor'));
    const gap = parseFloat(options.getAttribute('data-hui-combobox-gap') || '4') || 0;
    const bounds = getViewportBounds();
    const rect = reference.getBoundingClientRect();

    options.style.setProperty('--hui-combobox-anchor-width', `${rect.width}px`);
    options.style.maxWidth = `${Math.max(0, bounds.right - bounds.left - VIEWPORT_PADDING * 2)}px`;
    options.style.maxHeight = '';

    const { width, height } = options.getBoundingClientRect();

    const spaceBelow = bounds.bottom - rect.bottom - gap - VIEWPORT_PADDING;
    const spaceAbove = rect.top - bounds.top - gap - VIEWPORT_PADDING;
    const preferredSpace = preferred === 'bottom' ? spaceBelow : spaceAbove;
    const oppositeSpace = preferred === 'bottom' ? spaceAbove : spaceBelow;

    const side: Side = preferredSpace < height && oppositeSpace > preferredSpace
        ? (preferred === 'bottom' ? 'top' : 'bottom')
        : preferred;

    const space = Math.max(0, side === 'bottom' ? spaceBelow : spaceAbove);
    if (height > space) {
        options.style.maxHeight = `${Math.floor(space)}px`;
    }
    const renderedHeight = Math.min(height, space);

    const rtl = getComputedStyle(reference).direction === 'rtl';
    let left: number;
    if (align === 'center') {
        left = rect.left + rect.width / 2 - width / 2;
    } else if ((align === 'start') !== rtl) {
        left = rect.left;
    } else {
        left = rect.right - width;
    }
    left = clamp(left, bounds.left + VIEWPORT_PADDING, Math.max(bounds.left + VIEWPORT_PADDING, bounds.right - VIEWPORT_PADDING - width));
    const top = side === 'bottom' ? rect.bottom + gap : rect.top - gap - renderedHeight;

    const origin = containingBlockOrigin(options);
    options.style.left = `${Math.round(left - origin.x)}px`;
    options.style.top = `${Math.round(top - origin.y)}px`;

    options.setAttribute('data-placement', side);
    options.setAttribute('data-align', align);
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

function runTransition(el: HTMLElement, prefix: string): Promise<void> {
    if (!hasTransition(el, prefix)) return Promise.resolve();
    const { base, from, to } = getTransitionClasses(el, prefix);
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

// --- Combobox setup ---

function parseValue(raw: string | null): string[] {
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        const list = Array.isArray(parsed) ? parsed : [parsed];
        return list.filter((v) => v !== null && v !== undefined && v !== '').map(String);
    } catch (_) {
        return [raw];
    }
}

function setupCombobox(root: HTMLElement) {
    if (root.hasAttribute('data-hui-combobox-initialized')) return;

    const input = root.querySelector<HTMLInputElement>('[data-hui-combobox-input]');
    const options = root.querySelector<HTMLElement>('[data-hui-combobox-options]');
    if (!input || !options) return;

    root.setAttribute('data-hui-combobox-initialized', '');

    const button = root.querySelector<HTMLButtonElement>('[data-hui-combobox-button]');
    const noResults = root.querySelector<HTMLElement>('[data-hui-combobox-no-results]');
    const chips = root.querySelector<HTMLElement>('[data-hui-combobox-chips]');
    const chipTemplate = chips?.querySelector<HTMLTemplateElement>('template[data-hui-combobox-chip-template]') ?? null;
    const reference = root.querySelector<HTMLElement>('[data-hui-combobox-reference]') ?? input;

    const multiple = root.hasAttribute('data-hui-combobox-multiple');
    const searchable = root.hasAttribute('data-hui-combobox-searchable');
    const nullable = root.hasAttribute('data-hui-combobox-nullable');
    const immediate = root.hasAttribute('data-hui-combobox-immediate');
    const filterEnabled = root.hasAttribute('data-hui-combobox-filter');
    const name = root.getAttribute('data-hui-combobox-name');
    const max = multiple ? (parseInt(root.getAttribute('data-hui-combobox-max') || '', 10) || null) : null;

    const labels = new Map<string, string>();
    const initialValue = parseValue(root.getAttribute('data-hui-combobox-value'));
    let selected: string[] = [];
    let isOpen = false;
    let isTransitioning = false;
    let activeOption: HTMLElement | null = null;
    let query = '';
    let typeAheadBuffer = '';
    let typeAheadTimer: ReturnType<typeof setTimeout> | null = null;
    let frame: number | null = null;

    function isDisabled(): boolean {
        return root.hasAttribute('data-hui-combobox-disabled');
    }

    function isMaxReached(): boolean {
        return max !== null && selected.length >= max;
    }

    // --- Options ---

    function allOptions(): HTMLElement[] {
        return Array.from(options!.querySelectorAll<HTMLElement>(OPTION));
    }

    function navigableOptions(): HTMLElement[] {
        return allOptions().filter((o) => !o.hasAttribute('data-disabled') && !o.hasAttribute('data-hui-combobox-filtered'));
    }

    function optionLabel(option: HTMLElement): string {
        return option.getAttribute('data-label') ?? (option.textContent || '').trim();
    }

    function optionValue(option: HTMLElement): string {
        return option.getAttribute('data-value') ?? optionLabel(option);
    }

    function labelFor(value: string): string {
        return labels.get(value) ?? value;
    }

    function syncOptions() {
        allOptions().forEach((option) => {
            if (!option.id) option.id = uid('option');
            option.setAttribute('role', 'option');
            labels.set(optionValue(option), optionLabel(option));

            const isSelected = selected.includes(optionValue(option));
            option.setAttribute('aria-selected', isSelected ? 'true' : 'false');
            option.toggleAttribute('data-selected', isSelected);

            if (option.hasAttribute('data-disabled') || (!isSelected && isMaxReached())) {
                option.setAttribute('aria-disabled', 'true');
            } else {
                option.removeAttribute('aria-disabled');
            }
        });
    }

    function applyFilter() {
        const q = searchable && filterEnabled ? normalize(query.trim()) : '';

        allOptions().forEach((option) => {
            const match = q === '' || normalize(optionLabel(option)).includes(q);
            option.toggleAttribute('data-hui-combobox-filtered', !match);
            option.hidden = !match;
        });

        const hasResults = allOptions().some((o) => !o.hasAttribute('data-hui-combobox-filtered'));
        options!.toggleAttribute('data-empty', !hasResults);
        if (noResults) noResults.hidden = hasResults;

        if (activeOption && !navigableOptions().includes(activeOption)) {
            setActive(null);
        }
    }

    function setActive(option: HTMLElement | null, scroll = true) {
        allOptions().forEach((o) => o.toggleAttribute('data-active', o === option));
        activeOption = option;

        if (option) {
            input!.setAttribute('aria-activedescendant', option.id);
            if (scroll && typeof option.scrollIntoView === 'function') {
                option.scrollIntoView({ block: 'nearest' });
            }
        } else {
            input!.removeAttribute('aria-activedescendant');
        }
    }

    function move(delta: number) {
        const list = navigableOptions();
        if (list.length === 0) return;
        const index = activeOption ? list.indexOf(activeOption) : -1;
        const next = index === -1
            ? (delta > 0 ? 0 : list.length - 1)
            : (index + delta + list.length) % list.length;
        setActive(list[next]);
    }

    function activateEdge(edge: 'first' | 'last') {
        const list = navigableOptions();
        setActive(list.length ? list[edge === 'first' ? 0 : list.length - 1] : null);
    }

    function activateSelectedOr(edge: 'first' | 'last' | null) {
        const list = navigableOptions();
        const current = list.find((o) => selected.includes(optionValue(o)));
        if (current) {
            setActive(current);
        } else if (edge) {
            activateEdge(edge);
        }
    }

    // --- Selection ---

    function renderHiddenInputs() {
        root.querySelectorAll('input[data-hui-combobox-hidden-input]').forEach((el) => el.remove());
        if (!name) return;

        const values = multiple ? selected : [selected[0] ?? ''];
        values.forEach((value) => {
            const hidden = document.createElement('input');
            hidden.type = 'hidden';
            hidden.name = name;
            hidden.value = value;
            hidden.disabled = isDisabled();
            hidden.setAttribute('data-hui-combobox-hidden-input', '');
            root.appendChild(hidden);
        });
    }

    function createChip(value: string): HTMLElement {
        const text = labelFor(value);
        let chip: HTMLElement;

        const templateChild = chipTemplate?.content.firstElementChild;
        if (templateChild) {
            chip = templateChild.cloneNode(true) as HTMLElement;
        } else {
            chip = document.createElement('span');
            const labelEl = document.createElement('span');
            labelEl.setAttribute('data-hui-combobox-chip-label', '');
            const remove = document.createElement('button');
            remove.setAttribute('data-hui-combobox-chip-remove', '');
            remove.textContent = '×';
            chip.append(labelEl, remove);
        }

        chip.setAttribute('data-hui-combobox-chip', '');
        chip.setAttribute('data-value', value);

        const labelEl = chip.querySelector<HTMLElement>('[data-hui-combobox-chip-label]');
        if (labelEl) labelEl.textContent = text;

        const remove = chip.querySelector<HTMLElement>('[data-hui-combobox-chip-remove]');
        if (remove) {
            if (remove instanceof HTMLButtonElement) {
                remove.type = 'button';
                remove.disabled = isDisabled();
            }
            if (!remove.hasAttribute('aria-label')) {
                remove.setAttribute('aria-label', `Remove ${text}`);
            }
        }

        return chip;
    }

    function renderChips() {
        if (!chips) return;
        chips.querySelectorAll('[data-hui-combobox-chip]').forEach((el) => el.remove());
        selected.forEach((value) => chips.appendChild(createChip(value)));
    }

    function syncInputText() {
        if (multiple) {
            input!.value = query;
        } else {
            input!.value = selected.length ? labelFor(selected[0]) : '';
        }
    }

    function setSelected(values: string[], emit = true) {
        const unique = Array.from(new Set(values.map(String)));
        selected = unique.slice(0, multiple ? (max ?? unique.length) : 1);

        syncOptions();
        renderHiddenInputs();
        renderChips();
        root.toggleAttribute('data-has-value', selected.length > 0);
        root.toggleAttribute('data-max-reached', isMaxReached());

        if (emit) {
            root.dispatchEvent(new CustomEvent('hui:combobox:change', {
                bubbles: true,
                detail: {
                    value: multiple ? [...selected] : (selected[0] ?? null),
                    label: multiple ? selected.map(labelFor) : (selected.length ? labelFor(selected[0]) : null),
                },
            }));
        }
    }

    function selectOption(option: HTMLElement) {
        if (option.hasAttribute('data-disabled') || isDisabled()) return;

        const value = optionValue(option);
        labels.set(value, optionLabel(option));

        if (!multiple) {
            if (selected[0] !== value) setSelected([value]);
            query = '';
            syncInputText();
            close();
            return;
        }

        if (selected.includes(value)) {
            setSelected(selected.filter((v) => v !== value));
        } else if (!isMaxReached()) {
            setSelected([...selected, value]);
        } else {
            return;
        }

        if (query !== '') {
            query = '';
            input!.value = '';
            applyFilter();
            schedulePosition();
        }

        if (navigableOptions().includes(option)) setActive(option, false);
    }

    function deselect(value: string) {
        if (isDisabled() || !selected.includes(value)) return;
        setSelected(selected.filter((v) => v !== value));
    }

    // --- Open / Close ---

    function position() {
        if (isOpen) positionOptions(reference, options!);
    }

    function schedulePosition() {
        if (!isOpen || frame !== null) return;
        frame = requestAnimationFrame(() => {
            frame = null;
            position();
        });
    }

    let resizeObserver: ResizeObserver | null = null;

    function bindGlobalListeners() {
        document.addEventListener('pointerdown', onOutsidePointerDown, true);
        window.addEventListener('scroll', schedulePosition, true);
        window.addEventListener('resize', schedulePosition);
        window.visualViewport?.addEventListener('resize', schedulePosition);
        window.visualViewport?.addEventListener('scroll', schedulePosition);

        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(schedulePosition);
            resizeObserver.observe(reference);
            resizeObserver.observe(options!);
        }
    }

    function unbindGlobalListeners() {
        document.removeEventListener('pointerdown', onOutsidePointerDown, true);
        window.removeEventListener('scroll', schedulePosition, true);
        window.removeEventListener('resize', schedulePosition);
        window.visualViewport?.removeEventListener('resize', schedulePosition);
        window.visualViewport?.removeEventListener('scroll', schedulePosition);
        resizeObserver?.disconnect();
        resizeObserver = null;
        if (frame !== null) {
            cancelAnimationFrame(frame);
            frame = null;
        }
    }

    function open() {
        if (isOpen || isTransitioning || isDisabled()) return;
        isOpen = true;

        applyFilter();
        options!.hidden = false;
        options!.style.removeProperty('display');
        position();

        input!.setAttribute('aria-expanded', 'true');
        button?.setAttribute('aria-expanded', 'true');
        root.setAttribute('data-open', '');

        activateSelectedOr(null);
        bindGlobalListeners();
        runTransition(options!, 'data-hui-combobox-enter');

        root.dispatchEvent(new CustomEvent('hui:combobox:open', { bubbles: true }));
    }

    function close() {
        if (!isOpen || isTransitioning) return;

        const finish = () => {
            isOpen = false;
            isTransitioning = false;
            options!.hidden = true;
            options!.style.display = 'none';
            input!.setAttribute('aria-expanded', 'false');
            button?.setAttribute('aria-expanded', 'false');
            root.removeAttribute('data-open');
            unbindGlobalListeners();
            setActive(null);

            if (!multiple && nullable && searchable && input!.value.trim() === '' && selected.length) {
                setSelected([]);
            }

            query = '';
            syncInputText();
            applyFilter();

            root.dispatchEvent(new CustomEvent('hui:combobox:close', { bubbles: true }));
        };

        if (hasTransition(options!, 'data-hui-combobox-leave')) {
            isTransitioning = true;
            runTransition(options!, 'data-hui-combobox-leave').then(finish);
        } else {
            finish();
        }
    }

    function toggle() {
        if (isOpen) close();
        else open();
    }

    function onOutsidePointerDown(e: PointerEvent) {
        if (!root.contains(e.target as Node)) close();
    }

    // --- Type-ahead (non-searchable) ---

    function typeAhead(char: string) {
        typeAheadBuffer += normalize(char);
        if (typeAheadTimer) clearTimeout(typeAheadTimer);
        typeAheadTimer = setTimeout(() => {
            typeAheadBuffer = '';
        }, 350);

        const match = navigableOptions().find((o) => normalize(optionLabel(o)).startsWith(typeAheadBuffer));
        if (match) setActive(match);
    }

    // --- Keyboard ---

    function onKeydown(e: KeyboardEvent) {
        if (e.isComposing || isDisabled()) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (!isOpen) {
                    open();
                    if (!e.altKey && !activeOption) activateEdge('first');
                } else {
                    move(1);
                }
                break;

            case 'ArrowUp':
                e.preventDefault();
                if (e.altKey) {
                    close();
                } else if (!isOpen) {
                    open();
                    if (!activeOption) activateEdge('last');
                } else {
                    move(-1);
                }
                break;

            case 'Home':
            case 'End':
                if (isOpen && !searchable) {
                    e.preventDefault();
                    activateEdge(e.key === 'Home' ? 'first' : 'last');
                }
                break;

            case 'PageUp':
            case 'PageDown':
                if (isOpen) {
                    e.preventDefault();
                    activateEdge(e.key === 'PageUp' ? 'first' : 'last');
                }
                break;

            case 'Enter':
                if (isOpen) {
                    e.preventDefault();
                    if (activeOption) selectOption(activeOption);
                    else close();
                } else if (!searchable) {
                    e.preventDefault();
                    open();
                }
                break;

            case ' ':
                if (!searchable) {
                    e.preventDefault();
                    if (isOpen && activeOption) selectOption(activeOption);
                    else if (!isOpen) open();
                }
                break;

            case 'Escape':
                if (isOpen) {
                    e.preventDefault();
                    e.stopPropagation();
                    close();
                } else if (searchable && multiple && input!.value !== '') {
                    e.preventDefault();
                    query = '';
                    input!.value = '';
                    applyFilter();
                }
                break;

            case 'Tab':
                if (isOpen) close();
                break;

            case 'Backspace':
                if (multiple && input!.value === '' && selected.length > 0) {
                    deselect(selected[selected.length - 1]);
                }
                break;

            default:
                if (!searchable && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                    e.preventDefault();
                    if (!isOpen) open();
                    typeAhead(e.key);
                }
                break;
        }
    }

    function onInput() {
        if (!searchable || isDisabled()) return;
        query = input!.value;

        if (!isOpen) open();
        applyFilter();

        const list = navigableOptions();
        setActive(query.trim() !== '' && list.length ? list[0] : null);
        schedulePosition();

        root.dispatchEvent(new CustomEvent('hui:combobox:search', {
            bubbles: true,
            detail: { query },
        }));
    }

    // --- Disabled state ---

    function applyDisabled() {
        const disabled = isDisabled();
        root.toggleAttribute('data-disabled', disabled);
        input!.disabled = disabled;
        if (button) button.disabled = disabled;
        root.querySelectorAll<HTMLInputElement>('input[data-hui-combobox-hidden-input]').forEach((el) => {
            el.disabled = disabled;
        });
        chips?.querySelectorAll<HTMLButtonElement>('button[data-hui-combobox-chip-remove]').forEach((el) => {
            el.disabled = disabled;
        });
        if (disabled) close();
    }

    // --- ARIA setup ---

    if (!input.id) input.id = uid('input');
    if (!options.id) options.id = uid('options');

    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-haspopup', 'listbox');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-controls', options.id);
    input.setAttribute('aria-autocomplete', searchable ? 'list' : 'none');
    input.setAttribute('autocomplete', 'off');
    input.readOnly = !searchable;

    options.setAttribute('role', 'listbox');
    options.hidden = true;
    options.style.display = 'none';
    if (multiple) options.setAttribute('aria-multiselectable', 'true');

    if (button) {
        button.type = 'button';
        button.tabIndex = -1;
        button.setAttribute('aria-haspopup', 'listbox');
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', options.id);
    }

    syncOptions();
    setSelected(initialValue, false);
    syncInputText();
    applyFilter();
    applyDisabled();

    // --- Event listeners ---

    input.addEventListener('keydown', onKeydown);
    input.addEventListener('input', onInput);

    input.addEventListener('click', () => {
        if (!searchable) toggle();
        else open();
    });

    input.addEventListener('focus', () => {
        if (immediate) open();
    });

    button?.addEventListener('pointerdown', (e) => e.preventDefault());
    button?.addEventListener('click', (e) => {
        e.preventDefault();
        if (isDisabled()) return;
        toggle();
        input.focus({ preventScroll: true });
    });

    root.addEventListener('focusout', () => {
        setTimeout(() => {
            const active = document.activeElement;
            if (active && root.contains(active)) return;
            close();
        }, 0);
    });

    options.addEventListener('pointerdown', (e) => e.preventDefault());

    options.addEventListener('click', (e) => {
        const option = (e.target as HTMLElement).closest<HTMLElement>(OPTION);
        if (option && options.contains(option)) selectOption(option);
    });

    options.addEventListener('pointermove', (e) => {
        const option = (e.target as HTMLElement).closest<HTMLElement>(OPTION);
        if (option && option !== activeOption && !option.hasAttribute('data-disabled')) {
            setActive(option, false);
        }
    });

    options.addEventListener('pointerleave', () => setActive(null));

    chips?.addEventListener('click', (e) => {
        const remove = (e.target as HTMLElement).closest<HTMLElement>('[data-hui-combobox-chip-remove]');
        const chip = remove?.closest<HTMLElement>('[data-hui-combobox-chip]');
        if (!chip) return;
        e.preventDefault();
        deselect(chip.getAttribute('data-value') || '');
        input.focus({ preventScroll: true });
    });

    root.closest('form')?.addEventListener('reset', () => {
        setTimeout(() => {
            query = '';
            setSelected(initialValue);
            syncInputText();
            applyFilter();
        }, 0);
    });

    try {
        new MutationObserver(() => {
            syncOptions();
            applyFilter();
            if (!isOpen) return;
            if (!activeOption && query.trim() !== '') activateEdge('first');
            schedulePosition();
        }).observe(options, { childList: true, subtree: true });

        new MutationObserver(applyDisabled)
            .observe(root, { attributes: true, attributeFilter: ['data-hui-combobox-disabled'] });
    } catch (_) {
        // ignore MutationObserver issues
    }

    if (root.hasAttribute('data-hui-combobox-open')) open();

    (root as any)._hui = {
        open,
        close,
        toggle,
        getValue: () => (multiple ? [...selected] : (selected[0] ?? null)),
        setValue: (value: string | string[] | null) => {
            setSelected(value === null ? [] : (Array.isArray(value) ? value : [value]));
            syncInputText();
        },
    };
}

// --- Public JS API ---

function api(id: string): any {
    const el = document.getElementById(id) as any;
    return el?._hui ?? null;
}

export function openCombobox(id: string): void {
    api(id)?.open();
}

export function closeCombobox(id: string): void {
    api(id)?.close();
}

export function getComboboxValue(id: string): string | string[] | null {
    return api(id)?.getValue() ?? null;
}

export function setComboboxValue(id: string, value: string | string[] | null): void {
    api(id)?.setValue(value);
}

// --- Registration ---

export function registerComboboxes(root: Root = document) {
    const comboboxes = Array.from(root.querySelectorAll<HTMLElement>('[data-hui-combobox]'));
    comboboxes.forEach(setupCombobox);
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => registerComboboxes());
    } else {
        registerComboboxes();
    }
}
