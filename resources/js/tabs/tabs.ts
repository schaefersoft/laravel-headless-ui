type Root = Document | HTMLElement;

function isTrueAttr(el: Element, name: string): boolean {
    return el.hasAttribute(name);
}

function firstEnabledIndex(els: HTMLElement[]): number {
    for (let i = 0; i < els.length; i++) {
        if (!isTrueAttr(els[i], 'data-disabled')) return i;
    }
    return 0;
}

export function registerTabs(root: Root = document) {
    const containers = Array.from(root.querySelectorAll<HTMLElement>('[data-hui-tabs]'));

    containers.forEach((container) => {
        const tablist = container.querySelector<HTMLElement>('[data-hui-tablist]') || container;
        const tabs = Array.from(container.querySelectorAll<HTMLElement>('[data-hui-tab]'));
        const panels = Array.from(container.querySelectorAll<HTMLElement>('[data-hui-tabpanel]'));

        if (!tabs.length || !panels.length) return;

        // orientation
        const vertical = container.getAttribute('data-hui-tabs-orientation') === 'vertical' || container.hasAttribute('data-hui-tabs-vertical');
        tablist.setAttribute('role', 'tablist');
        tablist.setAttribute('aria-orientation', vertical ? 'vertical' : 'horizontal');

        // ensure ids and aria-controls/linking
        const uid = Math.random().toString(36).slice(2);
        tabs.forEach((tab, i) => {
            if (!tab.id) tab.id = `hui-tab-${uid}-${i}`;
        });
        panels.forEach((panel, i) => {
            if (!panel.id) panel.id = `hui-tabpanel-${uid}-${i}`;
        });

        const count = Math.min(tabs.length, panels.length);
        for (let i = 0; i < count; i++) {
            const tab = tabs[i];
            const panel = panels[i];
            tab.setAttribute('role', 'tab');
            panel.setAttribute('role', 'tabpanel');
            tab.setAttribute('aria-controls', panel.id);
            panel.setAttribute('aria-labelledby', tab.id);
        }

        function getInitialIndex(): number {
            // 1) container-provided index
            const attr = container.getAttribute('data-hui-tabs-initial-index');
            if (attr !== null) {
                const idx = parseInt(attr, 10);
                if (!Number.isNaN(idx) && idx >= 0 && idx < count) return idx;
            }
            // 2) any element marked active (tab or panel)
            for (let i = 0; i < count; i++) {
                const tab = tabs[i];
                const panel = panels[i];
                if (isTrueAttr(tab, 'data-active') || isTrueAttr(panel, 'data-active')) {
                    return i;
                }
            }
            // 3) first enabled
            return firstEnabledIndex(tabs);
        }

        function findNextEnabled(from: number, dir: 1 | -1): number {
            let i = from;
            for (let n = 0; n < count; n++) {
                i = (i + dir + count) % count;
                if (!isTrueAttr(tabs[i], 'data-disabled')) return i;
            }
            return from;
        }

        let active = Math.max(0, Math.min(getInitialIndex(), count - 1));
        if (isTrueAttr(tabs[active], 'data-disabled')) active = firstEnabledIndex(tabs);

        let applying = false;

        function setPresent(el: HTMLElement, name: string, present: boolean) {
            const has = el.hasAttribute(name);
            if (present && !has) el.setAttribute(name, '');
            if (!present && has) el.removeAttribute(name);
        }

        function setAttr(el: HTMLElement, name: string, value: string) {
            if (el.getAttribute(name) !== value) el.setAttribute(name, value);
        }

        function applyState(focus = false) {
            applying = true;
            for (let i = 0; i < count; i++) {
                const selected = i === active;
                const tab = tabs[i];
                const panel = panels[i];

                setAttr(tab, 'aria-selected', selected ? 'true' : 'false');
                tab.tabIndex = selected && !isTrueAttr(tab, 'data-disabled') ? 0 : -1;
                setPresent(tab, 'data-active', selected);

                setPresent(panel, 'data-active', selected);
                setPresent(panel, 'hidden', !selected);
            }
            if (focus) tabs[active].focus();
            applying = false;
        }

        function setActive(index: number, focus = false) {
            if (index < 0 || index >= count) return;
            if (isTrueAttr(tabs[index], 'data-disabled')) return;
            if (index === active) {
                if (focus) tabs[active].focus();
                return;
            }
            active = index;
            applyState(focus);
        }

        tabs.forEach((tab, i) => {
            tab.addEventListener('click', (e) => {
                if (isTrueAttr(tab, 'data-disabled')) {
                    e.preventDefault();
                    return;
                }
                setActive(i, true);
            });
        });

        // Keyboard navigation
        const onKeydown = (e: KeyboardEvent) => {
            const key = e.key;
            let handled = false;
            if (vertical) {
                if (key === 'ArrowUp') { setActive(findNextEnabled(active, -1), true); handled = true; }
                if (key === 'ArrowDown') { setActive(findNextEnabled(active, +1), true); handled = true; }
            } else {
                if (key === 'ArrowLeft') { setActive(findNextEnabled(active, -1), true); handled = true; }
                if (key === 'ArrowRight') { setActive(findNextEnabled(active, +1), true); handled = true; }
            }
            if (key === 'Home') { setActive(firstEnabledIndex(tabs), true); handled = true; }
            if (key === 'End') { setActive((() => { for (let i = count - 1; i >= 0; i--) { if (!isTrueAttr(tabs[i], 'data-disabled')) return i; } return active; })(), true); handled = true; }
            if (key === 'Enter' || key === ' ') { setActive(active, true); handled = true; }
            if (handled) {
                e.preventDefault();
                e.stopPropagation();
            }
        };
        tablist.addEventListener('keydown', onKeydown);

        // Observe disabled changes; ensure active remains enabled
        try {
            const mo = new MutationObserver((mutations) => {
                if (applying) return;
                let changed = false;
                for (const m of mutations) {
                    if (m.type === 'attributes') {
                        if (m.attributeName === 'data-disabled' || m.attributeName === 'data-active') {
                            changed = true;
                        }
                    }
                }
                if (changed) {
                    if (isTrueAttr(tabs[active], 'data-disabled')) {
                        active = firstEnabledIndex(tabs);
                    } else {
                        // If some other tab gained data-active, prefer that
                        for (let i = 0; i < count; i++) {
                            if (i !== active && isTrueAttr(tabs[i], 'data-active')) {
                                active = i;
                                break;
                            }
                        }
                    }
                    applyState(false);
                }
            });
            tabs.forEach(t => mo.observe(t, { attributes: true, attributeFilter: ['data-disabled', 'data-active'] }));
        } catch (_) { }

        applyState(false);
    });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => registerTabs());
    } else {
        registerTabs();
    }
}
