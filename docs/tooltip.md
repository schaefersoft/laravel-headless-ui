# Tooltip

A minimal, responsive tooltip that supports hover, focus and touch. It auto-positions to stay within the viewport and closes on outside click or when hover/focus leaves the trigger.

Blade component namespace: `x-hui::tooltip.*`.

## Usage

```bladehtml
<x-hui::tooltip class="">
    <!-- Trigger content goes here (text, button, icon, etc.) -->
    Hover or tap me

    <x-hui::tooltip.content class="">
        Tooltip content goes here.
    </x-hui::tooltip.content>
></x-hui::tooltip>
```

Notes:

- Works with mouse (hover), keyboard (focus) and touch (tap to show, tap outside to close).
- Positions itself above by default, flips below if needed, and clamps within the viewport horizontally and vertically.
- Press `Esc` to close an open tooltip.
- Minimal styling included; pass `class` on `tooltip` and `tooltip.content` to customize.

## Props

### Tooltip

| Prop       | Type      | Default | Description |
|------------|-----------|---------|-------------|
| `class`    | `string`  | `""`    | Custom classes for the wrapper. |
| `open`     | `boolean` | `false` | Opens the tooltip by default. When used with `disabled`, the tooltip stays open and cannot be closed. |
| `disabled` | `boolean` | `false` | Disables interactions. If combined with `open`, the tooltip remains open and uncloseable until one of the attributes changes. |

### TooltipContent

| Prop        | Type                                         | Default  | Description |
|-------------|----------------------------------------------|----------|-------------|
| `class`     | `string`                                     | `""`     | Custom classes for the content panel. |
| `arrow`     | `boolean`                                    | `true`   | Shows a small arrow pointing toward the trigger; color matches the content background. |
| `position`  | `"top" | "bottom" | "left" | "right"` | `"top"` | Preferred placement. Tooltip auto-flips to avoid viewport overflow and may choose another side if needed. |

### Example with Arrow
![Tooltip example](./assets/tooltip/tooltip_01.png)
```bladehtml
<x-hui::tooltip>
    Hover me

    <x-hui::tooltip.content arrow>
        Tooltip with arrow
    </x-hui::tooltip.content>
</x-hui::tooltip>
```

### Examples with Position
![Tooltip example](./assets/tooltip/tooltip_02.png)
```bladehtml
<x-hui::tooltip>
    Left Pref
    <x-hui::tooltip.content arrow position="left">
        I prefer left, will flip if needed.
    </x-hui::tooltip.content>
</x-hui::tooltip>

<x-hui::tooltip>
    Bottom Pref
    <x-hui::tooltip.content arrow position="bottom">
        I prefer bottom, will flip if needed.
    </x-hui::tooltip.content>
</x-hui::tooltip>
```

### Open by Default and Disabled

```bladehtml
<x-hui::tooltip open>
  Hover me
  <x-hui::tooltip.content arrow>Opened by default</x-hui::tooltip.content>
</x-hui::tooltip>

<x-hui::tooltip disabled>
  Hover me
  <x-hui::tooltip.content>Will not open (disabled)</x-hui::tooltip.content>
</x-hui::tooltip>
```
### Nested tooltip

![Tooltip example](./assets/tooltip/tooltip_03.png)
```bladehtml
<x-hui::tooltip open>
  Hover me
  <x-hui::tooltip.content>
      <x-hui::tooltip>
          Hover me nested
          <x-hui::tooltip.content>
              Nested content
          </x-hui::tooltip.content>
      </x-hui::tooltip>
  </x-hui::tooltip.content>
</x-hui::tooltip>
```
