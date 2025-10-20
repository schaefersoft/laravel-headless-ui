import { describe, it, expect, beforeEach, vi } from 'vitest'

// Utility to reset modules between tests so auto-registration runs fresh
async function loadModule() {
  // Ensure any previous auto-registered listeners don't accumulate
  vi.resetModules()
  return await import('./tooltip')
}

function setupDom({
  vw = 800,
  vh = 600,
  hostRect = { left: 200, top: 200, width: 100, height: 40 },
  contentSize = { w: 200, h: 60 },
  positionAttr,
  open = false,
  disabled = false,
  contentBg,
}: Partial<{
  vw: number
  vh: number
  hostRect: { left: number; top: number; width: number; height: number }
  contentSize: { w: number; h: number }
  positionAttr?: 'top' | 'bottom' | 'left' | 'right'
  open?: boolean
  disabled?: boolean
  contentBg?: string
}> = {}) {
  // Configure viewport
  Object.defineProperty(window, 'innerWidth', { value: vw, configurable: true })
  Object.defineProperty(window, 'innerHeight', { value: vh, configurable: true })

  document.body.innerHTML = `
    <div data-hui-tooltip ${open ? 'data-hui-tooltip-open' : ''} ${disabled ? 'data-hui-tooltip-disabled' : ''}>
      Trigger
      <div data-hui-tooltip-content ${positionAttr ? `data-hui-tooltip-position="${positionAttr}"` : ''} style="display:none"></div>
    </div>
  `

  const container = document.querySelector('[data-hui-tooltip]') as HTMLElement
  const content = container.querySelector('[data-hui-tooltip-content]') as HTMLElement

  // Mock host rect
  const hostRight = hostRect.left + hostRect.width
  const hostBottom = hostRect.top + hostRect.height
  container.getBoundingClientRect = () => ({
    left: hostRect.left,
    top: hostRect.top,
    width: hostRect.width,
    height: hostRect.height,
    right: hostRight,
    bottom: hostBottom,
    x: hostRect.left,
    y: hostRect.top,
    toJSON() { return this as any },
  } as DOMRect)

  // Mock content rect used by measure()
  content.getBoundingClientRect = () => ({
    left: 0,
    top: 0,
    width: contentSize.w,
    height: contentSize.h,
    right: contentSize.w,
    bottom: contentSize.h,
    x: 0,
    y: 0,
    toJSON() { return this as any },
  } as DOMRect)

  if (contentBg) {
    content.style.backgroundColor = contentBg
  }

  return { container, content }
}

describe('tooltip', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('opens on focus and sets placement top/bottom with arrow x offset', async () => {
    const { container, content } = setupDom({
      vw: 800,
      vh: 600,
      hostRect: { left: 300, top: 300, width: 100, height: 40 },
      contentSize: { w: 200, h: 60 },
      positionAttr: 'top',
      contentBg: 'rgb(255, 0, 0)'
    })

    await loadModule() // auto-registers

    // Focusin should open
    container.dispatchEvent(new Event('focusin'))

    expect(content.getAttribute('data-open')).toBe('true')
    expect(content.style.display).toBe('block')
    expect(['top', 'bottom']).toContain(content.getAttribute('data-placement'))
    // Arrow color syncs
    expect(content.style.getPropertyValue('--hui-tooltip-bg')).toBe('rgb(255, 0, 0)')
    // Horizontal arrow offset should be set for top/bottom placements
    expect(content.style.getPropertyValue('--hui-tooltip-arrow-x')).not.toBe('')
  })

  it('respects preferred left and falls back to top/bottom when left/right do not fit', async () => {
    const { container, content } = setupDom({
      vw: 250,
      vh: 300,
      // near middle vertically, close to both left and right edges to force left/right failure
      hostRect: { left: 120, top: 120, width: 20, height: 20 },
      // Big content to exceed left/right space
      contentSize: { w: 220, h: 50 },
      positionAttr: 'left',
    })

    // Make right space tiny by mocking right position close to viewport edge
    const cr = container.getBoundingClientRect()
    container.getBoundingClientRect = () => ({ ...cr, right: 140 } as DOMRect)

    await loadModule()

    container.dispatchEvent(new Event('focusin'))

    const placement = content.getAttribute('data-placement')
    expect(['top', 'bottom']).toContain(placement)
    // Vertical/horizontal arrow var consistent with placement
    if (placement === 'top' || placement === 'bottom') {
      expect(content.style.getPropertyValue('--hui-tooltip-arrow-x')).not.toBe('')
      expect(content.style.getPropertyValue('--hui-tooltip-arrow-y')).toBe('')
    } else {
      expect(content.style.getPropertyValue('--hui-tooltip-arrow-y')).not.toBe('')
      expect(content.style.getPropertyValue('--hui-tooltip-arrow-x')).toBe('')
    }
  })

  it('closes on Escape', async () => {
    const { container, content } = setupDom({ positionAttr: 'top' })
    await loadModule()

    container.dispatchEvent(new Event('focusin'))
    expect(content.getAttribute('data-open')).toBe('true')

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(content.getAttribute('data-open')).toBe('false')
    expect(content.style.display).toBe('none')
  })

  it('stays open when disabled + open and ignores Escape', async () => {
    const { container, content } = setupDom({ open: true, disabled: true })
    await loadModule()

    // It should be shown on init
    expect(content.getAttribute('data-open')).toBe('true')
    expect(content.style.display).toBe('block')

    // Try to close via Escape — should be ignored
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(content.getAttribute('data-open')).toBe('true')
    expect(content.style.display).toBe('block')
  })
})

