import {describe, it, expect, beforeEach} from 'vitest'
import {pct, registerRangeSliders} from './range-slider'

function createContainer(html: string) {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = html.trim()
    return wrapper.firstElementChild as HTMLElement
}

function stubRect(el: Element, left = 0, width = 100) {
    // @ts-ignore
    el.getBoundingClientRect = () => ({
        left,
        width,
        right: left + width,
        top: 0,
        bottom: 0,
        height: 10,
        x: left,
        y: 0,
        toJSON() {
            return {}
        },
    })
}

describe('range-slider', () => {
    beforeEach(() => {
        document.body.innerHTML = ''
    })

    it('calculates percent correctly', () => {
        expect(pct(100, 0, 200)).toBe(50);
        expect(pct(0, 0, 0)).toBe(0);
    })

    it('moves correct thumb on track click tie-break', () => {
        const container = createContainer(`
      <div data-hui-range-slider>
        <div data-hui-range-slider-track style="width: 300px;">
          <div data-hui-range-slider-track-value></div>
        </div>
        <input class="hui-range-slider-thumb" data-hui-range-slider-thumb="min" type="range" min="0" max="100" step="1" value="50" />
        <input class="hui-range-slider-thumb" data-hui-range-slider-thumb="max" type="range" min="0" max="100" step="1" value="50" />
      </div>
    `)
        document.body.appendChild(container)

        const track = container.querySelector('[data-hui-range-slider-track]') as HTMLElement
        stubRect(track, 0, 100)

        registerRangeSliders(document)

        // Click to the right (75) -> should target max
        track.dispatchEvent(new MouseEvent('mousedown', {bubbles: true, clientX: 75}))
        window.dispatchEvent(new MouseEvent('mouseup', {bubbles: true, clientX: 75}))

        const min = container.querySelector<HTMLInputElement>('[data-hui-range-slider-thumb="min"]')!
        const max = container.querySelector<HTMLInputElement>('[data-hui-range-slider-thumb="max"]')!
        expect(min.value).toBe('50')
        expect(max.value).toBe('75')

        // Click to the left (25) -> should target min
        track.dispatchEvent(new MouseEvent('mousedown', {bubbles: true, clientX: 25}))
        window.dispatchEvent(new MouseEvent('mouseup', {bubbles: true, clientX: 25}))
        expect(min.value).toBe('25')
        expect(max.value).toBe('75')
    })

    it('renders fill from min thumb to right edge when only min present', () => {
        const container = createContainer(`
      <div data-hui-range-slider>
        <div data-hui-range-slider-track>
          <div data-hui-range-slider-track-value></div>
        </div>
        <strong data-hui-range-slider-value="min"></strong>
        <strong data-hui-range-slider-value="max"></strong>
        <input class="hui-range-slider-thumb" data-hui-range-slider-thumb="min" type="range" min="0" max="100" step="1" value="25" />
      </div>
    `)
        document.body.appendChild(container)

        registerRangeSliders(document)

        const fill = container.querySelector<HTMLElement>('[data-hui-range-slider-track-value]')!
        expect(fill.style.left).toBe('25%')
        expect(fill.style.width).toBe('75%')

        // Displays
        const dMin = container.querySelector<HTMLElement>('[data-hui-range-slider-value="min"]')!
        const dMax = container.querySelector<HTMLElement>('[data-hui-range-slider-value="max"]')!
        expect(dMin.textContent).toBe('25')
        expect(dMax.textContent).toBe('100') // effective max
    })

    it('renders fill from left edge to max thumb when only max present', () => {
        const container = createContainer(`
      <div data-hui-range-slider>
        <div data-hui-range-slider-track>
          <div data-hui-range-slider-track-value></div>
        </div>
        <input class="hui-range-slider-thumb" data-hui-range-slider-thumb="max" type="range" min="0" max="100" step="1" value="60" />
      </div>
    `)
        document.body.appendChild(container)

        registerRangeSliders(document)

        const fill = container.querySelector<HTMLElement>('[data-hui-range-slider-track-value]')!
        expect(fill.style.left).toBe('0%')
        expect(fill.style.width).toBe('60%')
    })

    it('syncs between number inputs and thumbs (min)', () => {
        const container = createContainer(`
      <div data-hui-range-slider>
        <div data-hui-range-slider-track>
          <div data-hui-range-slider-track-value></div>
        </div>
        <input data-hui-range-slider-value="min" type="number" />
        <input class="hui-range-slider-thumb" data-hui-range-slider-thumb="min" type="range" min="0" max="100" step="5" value="10" />
        <input class="hui-range-slider-thumb" data-hui-range-slider-thumb="max" type="range" min="0" max="100" step="5" value="50" />
      </div>
    `)
        document.body.appendChild(container)

        registerRangeSliders(document)

        const minInput = container.querySelector<HTMLInputElement>('[data-hui-range-slider-value="min"]')!
        const minThumb = container.querySelector<HTMLInputElement>('[data-hui-range-slider-thumb="min"]')!

        // thumb -> input
        minThumb.value = '45'
        minThumb.dispatchEvent(new Event('input', {bubbles: true}))
        expect(minInput.value).toBe('45')

        // input -> thumb (snap to step=5 and clamp vs max=50)
        minInput.value = '53'
        minInput.dispatchEvent(new Event('input', {bubbles: true}))
        expect(minThumb.value).toBe('50') // clamped to max thumb
    })

    it('aria-disabled reflects when all thumbs disabled', () => {
        const container = createContainer(`
      <div data-hui-range-slider>
        <div data-hui-range-slider-track>
          <div data-hui-range-slider-track-value></div>
        </div>
        <input class="hui-range-slider-thumb" data-hui-range-slider-thumb="min" type="range" min="0" max="100" value="10" disabled />
        <input class="hui-range-slider-thumb" data-hui-range-slider-thumb="max" type="range" min="0" max="100" value="90" disabled />
      </div>
    `)
        document.body.appendChild(container)

        registerRangeSliders(document)

        expect(container.getAttribute('aria-disabled')).toBe('true')
    })
})

