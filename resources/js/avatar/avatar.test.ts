import { describe, it, expect, beforeEach } from 'vitest';
import { registerAvatars } from './avatar';

function setupDomWithImage() {
  document.body.innerHTML = `
    <div data-ui-avatar>
      <img id="img" src="invalid://url" alt="avatar" />
      <span id="fb" data-ui-avatar-fallback style="display:none" aria-hidden="true">JD</span>
    </div>
  `;
}

function setupDomWithoutImage() {
  document.body.innerHTML = `
    <div data-ui-avatar>
      <span id="fb" data-ui-avatar-fallback aria-hidden="false">JD</span>
    </div>
  `;
}

describe('avatar controller', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('shows fallback when image errors', () => {
    setupDomWithImage();
    registerAvatars();
    const img = document.getElementById('img') as HTMLImageElement;
    const fb = document.getElementById('fb') as HTMLElement;

    // Simulate error event
    img.dispatchEvent(new Event('error'));

    expect((img as any).style.display).toBe('none');
    expect(fb.style.display).toBe('flex');
    expect(fb.getAttribute('aria-hidden')).toBe('false');
  });

  it('keeps fallback visible when no image is present', () => {
    setupDomWithoutImage();
    registerAvatars();
    const fb = document.getElementById('fb') as HTMLElement;
    expect(fb.getAttribute('aria-hidden')).toBe('false');
  });
});

