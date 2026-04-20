# Toggle

Accessible, headless toggle (switch) with keyboard support and form syncing.

![Toggle example](./assets/toggle/toggle_01.png)

## Usage

Blade components: `x-hui::toggle`, `x-hui::toggle.thumb`

```bladehtml
<x-hui::toggle checked name="my_toggle">
    <x-hui::toggle.thumb/>
</x-hui::toggle>
```

### Disabled

```bladehtml
<x-hui::toggle disabled name="my_toggle">
    <x-hui::toggle.thumb/>
</x-hui::toggle>
```

### Content inside the thumb

The thumb can contain child elements such as icons.

![Toggle example](./assets/toggle/toggle_02.png)

```bladehtml
<x-hui::toggle name="my_toggle">
    <x-hui::toggle.thumb>
        <!-- Add any content - e.g. SVG icon -->
    </x-hui::toggle.thumb>
</x-hui::toggle>
```

### Form integration

When the `name` prop is set, the toggle renders a hidden checkbox that stays in sync with the toggle state. This allows the value to be submitted with standard form submissions.

## Styling

Use ARIA attributes (`aria-checked`, `aria-disabled`) to style the toggle.

> [!NOTE]
> Minimal defaults are provided (inline-block, border-radius, thumb animation). All are overridable.

```css
.hui-toggle {
    background-color: lightgray;
}
.hui-toggle[aria-checked="true"] {
    background-color: blue;
}

.hui-toggle .hui-toggle-thumb {
    background-color: white;
}
.hui-toggle[aria-checked="true"] .hui-toggle-thumb {
    filter: drop-shadow(/* add your drop shadow here */);
}
```

### Using Tailwind

```bladehtml
<x-hui::toggle class="group bg-zinc-200 aria-checked:bg-green-500">
    <x-hui::toggle.thumb class="group-aria-checked:drop-shadow-green-700 group-aria-checked:drop-shadow-lg/60"/>
</x-hui::toggle>
```

## Props

### Toggle

| Prop       | Type      | Default | Description                                                                             |
|------------|-----------|---------|-----------------------------------------------------------------------------------------|
| `class`    | `string`  | `""`    | Custom classes for the toggle.                                                          |
| `checked`  | `boolean` | `false` | Initial checked state; reflected to `aria-checked`.                                     |
| `disabled` | `boolean` | `false` | Disables interaction; reflected to `aria-disabled` and removes focus (`tabindex="-1"`).  |
| `name`     | `string`  | `null`  | When set, renders a hidden checkbox and keeps it in sync.                                |

> [!NOTE]
> Allows all valid HTML `<div/>` attributes (class, style, data-*, aria-*, etc.).

### Thumb

| Prop    | Type     | Default | Description                   |
|---------|----------|---------|-------------------------------|
| `class` | `string` | `""`    | Custom classes for the thumb. |

> [!NOTE]
> Renders a `<div/>` marked with `aria-hidden="true"`. It mirrors `aria-checked`/`aria-disabled` for styling.

## Accessibility

### Keyboard

| Key        | Action                          |
|------------|---------------------------------|
| `Space`    | Toggle the switch when focused  |

### ARIA

- The toggle has `role="switch"` with `aria-checked` reflecting the current state.
- Disabled toggles are marked with `aria-disabled="true"` and removed from tab order (`tabindex="-1"`).
- The thumb is marked `aria-hidden="true"` as it is purely decorative.
