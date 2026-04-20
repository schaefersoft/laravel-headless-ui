# Range Slider

A single- or dual-thumb slider with a filled track segment and optional synced inputs or display elements.

![Range slider example](./assets/range-slider/range-slider_01.png)

## Usage

Blade components: `x-hui::range-slider`, `x-hui::range-slider.track`, `x-hui::range-slider.track.value`, `x-hui::range-slider.thumb`, `x-hui::range-slider.input`

### Dual-thumb slider

```bladehtml
<x-hui::range-slider>
    <x-hui::range-slider.track>
        <x-hui::range-slider.track.value/>

        <x-hui::range-slider.thumb role="min" name="lower" min="0" max="100" step="1" value="20"/>
        <x-hui::range-slider.thumb role="max" name="upper" min="0" max="100" step="1" value="80"/>
    </x-hui::range-slider.track>
</x-hui::range-slider>
```

> [!IMPORTANT]
> Each thumb requires a `role` of `min` or `max` (or the `Schaefersoft\HeadlessUI\Enums\RangeSlider\ThumbRole` enum).

### Single-thumb (min only)

Fills from the thumb to the max edge.

![Range slider example](./assets/range-slider/range-slider_02.png)

```bladehtml
<x-hui::range-slider>
    <x-hui::range-slider.track>
        <x-hui::range-slider.track.value/>
        <x-hui::range-slider.thumb role="min" min="0" max="100" step="1" value="35"/>
    </x-hui::range-slider.track>
</x-hui::range-slider>
```

### Single-thumb (max only)

Fills from the min edge to the thumb.

![Range slider example](./assets/range-slider/range-slider_03.png)

```bladehtml
<x-hui::range-slider>
    <x-hui::range-slider.track>
        <x-hui::range-slider.track.value/>
        <x-hui::range-slider.thumb role="max" min="0" max="100" step="1" value="65"/>
    </x-hui::range-slider.track>
</x-hui::range-slider>
```

### Synced inputs and displays

Mirror thumb values into inputs or display elements placed inside the slider.

- **Inputs (two-way):** updating the slider updates the input; typing in the input updates the slider. Values snap to `step` and are clamped to prevent crossing.
- **Displays (one-way):** any element with `data-hui-range-slider-value` has its text content kept in sync.

```bladehtml
<x-hui::range-slider>
    <x-hui::range-slider.track>
        <x-hui::range-slider.track.value/>
        <x-hui::range-slider.thumb role="min" min="0" max="100" step="1" value="20"/>
        <x-hui::range-slider.thumb role="max" min="0" max="100" step="1" value="80"/>
    </x-hui::range-slider.track>

    <div>
        <x-hui::range-slider.input role="min" class="w-20"/>
        <span data-hui-range-slider-value="min"></span>
    </div>

    <div>
        <x-hui::range-slider.input role="max" class="w-20"/>
        <span data-hui-range-slider-value="max"></span>
    </div>
</x-hui::range-slider>
```

> [!NOTE]
> - For single-thumb sliders, the missing side is treated as the edge (min or max) for fill and display.
> - Clicking the track moves the closest thumb; if equidistant, the click side determines which thumb moves.

## Styling

All components except `x-hui::range-slider.thumb` accept a `class` attribute. Since the thumb renders a native `<input type="range"/>`, it must be styled through CSS pseudo-elements:

```css
.hui-range-slider .hui-range-slider-thumb::-webkit-slider-thumb,
.hui-range-slider .hui-range-slider-thumb::-moz-range-thumb {
    background: green;
}
```

## Props

### RangeSlider

| Prop    | Type     | Default | Description                        |
|---------|----------|---------|------------------------------------|
| `class` | `string` | `""`    | Custom classes for the wrapper.    |

> [!NOTE]
> Allows all valid HTML `<div/>` attributes (class, style, data-*, etc.).

### RangeSliderTrack

| Prop    | Type     | Default | Description                      |
|---------|----------|---------|----------------------------------|
| `class` | `string` | `""`    | Custom classes for the track.    |

> [!NOTE]
> Allows all valid HTML `<div/>` attributes (class, style, data-*, etc.).

### RangeSliderValue

| Prop    | Type     | Default | Description                                |
|---------|----------|---------|--------------------------------------------|
| `class` | `string` | `""`    | Custom classes for the filled track area.  |

> [!NOTE]
> Allows all valid HTML `<div/>` attributes (class, style, data-*, etc.).

### RangeSliderThumb

| Prop   | Type                    | Default    | Description                                                          |
|--------|-------------------------|------------|----------------------------------------------------------------------|
| `role` | `string` or `ThumbRole` | (required) | Determines if the thumb is the upper (`max`) or lower (`min`) value. |

> [!NOTE]
> Renders a native `<input type="range"/>`. Allows all valid HTML `<input/>` attributes (min, max, step, value, disabled, name, etc.).

### RangeSliderInput

| Prop   | Type                    | Default    | Description                                                     |
|--------|-------------------------|------------|-----------------------------------------------------------------|
| `role` | `string` or `ThumbRole` | (required) | Which thumb this input syncs with (`min` or `max`).             |

> [!NOTE]
> Renders a native `<input/>`. Allows all valid HTML `<input/>` attributes (class, style, data-*, etc.).

## Accessibility

### Keyboard

Native `<input type="range">` keyboard controls apply:

| Key                        | Action                          |
|----------------------------|---------------------------------|
| `ArrowLeft` / `ArrowDown`  | Decrease value by one step      |
| `ArrowRight` / `ArrowUp`   | Increase value by one step      |

### ARIA

- The wrapper reflects `aria-disabled="true"` when all thumbs are disabled.
- Each thumb inherits native range input semantics (value, min, max announcements).
