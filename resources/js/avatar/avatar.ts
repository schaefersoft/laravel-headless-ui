export function registerAvatars(root: Document | HTMLElement = document) {
    const containers = Array.from(root.querySelectorAll<HTMLElement>('[data-ui-avatar]'));

    containers.forEach((container) => {
        const img = container.querySelector('img');
        const fallback = container.querySelector<HTMLElement>('[data-ui-avatar-fallback]');

        function showFallback() {
            if (img)
                (img as HTMLElement).style.display = 'none';
            if (fallback) {
                fallback.style.display = 'flex';
                fallback.setAttribute('aria-hidden', 'false');
            }
        }

        if (img) {
            img.addEventListener('error', showFallback, {once: true});

            const anyImg = img as any;
            const failed = (typeof anyImg.naturalWidth === 'number' && anyImg.naturalWidth === 0 && anyImg.complete === true);
            if (failed) showFallback();
        } else {
            if (fallback) {
                fallback.style.display = 'flex';
                fallback.setAttribute('aria-hidden', 'false');
            }
        }
    });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => registerAvatars());
    } else {
        registerAvatars();
    }
}

