export function registerDisclosures(root: Document | HTMLElement = document) {
    const disclosures = Array.from(
        root.querySelectorAll<HTMLElement>('[data-hui-disclosure]')
    );

    const toggleDisclosure = (disclosure: HTMLElement, force?: "open" | "close") => {
        const isOpen = disclosure.hasAttribute("open");

        if (force === "close" || (force === undefined && isOpen)) {
            disclosure.removeAttribute("open");
            disclosure.removeAttribute("data-opened");
            return;
        }

        if (force === "open" || (force === undefined && !isOpen)) {
            disclosure.setAttribute("open", "");
            disclosure.setAttribute("data-opened", String(Date.now()));
        }
    };

    const enforceMaxOpen = (container: HTMLElement, maxCount: number, opening?: HTMLElement) => {
        if (!Number.isFinite(maxCount) || maxCount <= 0) return;

        const all = Array.from(
            container.querySelectorAll<HTMLElement>(':scope > [data-hui-disclosure]')
        );

        const opened = all
            .filter(d => d.hasAttribute("open"))
            .sort((a, b) => {
                const ta = Number(a.getAttribute("data-opened") ?? "0");
                const tb = Number(b.getAttribute("data-opened") ?? "0");
                return ta - tb; // oldest first
            });

        const openedCount = opened.length;

        let toClose = openedCount - maxCount;
        if (toClose <= 0) return;

        for (const d of opened) {
            if (toClose <= 0) break;
            if (opening && d === opening) continue;
            toggleDisclosure(d, "close");
            toClose--;
        }

        if (toClose > 0 && opening && opening.hasAttribute("open")) {
            toggleDisclosure(opening, "close");
        }
    };

    disclosures.forEach((disclosure) => {
        const summary = disclosure.querySelector<HTMLElement>(
            '[data-hui-disclosure-summary]'
        );

        if (!summary) return;

        summary.addEventListener("click", (e) => {
            e.preventDefault();

            if (disclosure.hasAttribute("data-disabled")) return;

            const container = disclosure.parentElement?.matches('[data-hui-disclosure-container]')
                ? (disclosure.parentElement as HTMLElement)
                : null;

            const isOpening = !disclosure.hasAttribute("open");

            toggleDisclosure(disclosure);

            if (container && isOpening) {
                const maxCountAttr = container.getAttribute("data-max-count");
                const maxCount = maxCountAttr ? parseInt(maxCountAttr, 10) : NaN;
                enforceMaxOpen(container, maxCount, disclosure);
            }
        });
    });
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => registerDisclosures());
    } else {
        registerDisclosures();
    }
}
