# Flyout

![Flyout example](./assets/flyout/flyout_01.png)

An accessible slide-out panel built on the native `<dialog>` element. Supports all four positions, transitions, focus
trapping, and a responsive inline mode for sidebar layouts.

## Usage

Blade components: `x-hui::flyout`, `x-hui::flyout.background`, `x-hui::flyout.panel`, `x-hui::flyout.title`,
`x-hui::flyout.description`

### Basic flyout

```bladehtml

<button data-hui-flyout-trigger="my-flyout">Open</button>

<x-hui::flyout id="my-flyout" position="right">
    <x-hui::flyout.background class="bg-black/40"/>

    <x-hui::flyout.panel class="w-80 h-full bg-white shadow-xl">
        <x-hui::flyout.title>Panel Title</x-hui::flyout.title>
        <x-hui::flyout.description>Some description.</x-hui::flyout.description>

        <button data-hui-flyout-close>Close</button>
    </x-hui::flyout.panel>
</x-hui::flyout>
```

### Positions

The `position` prop controls which edge the panel slides from.

```bladehtml

<x-hui::flyout position="right">...</x-hui::flyout>  {{-- Slides from right (default) --}}
<x-hui::flyout position="left">...</x-hui::flyout>   {{-- Slides from left --}}
<x-hui::flyout position="top">...</x-hui::flyout>    {{-- Slides from top --}}
<x-hui::flyout position="bottom">...</x-hui::flyout> {{-- Bottom sheet --}}
```

### Closing the flyout

The flyout can be closed by:

- Clicking a `data-hui-flyout-close` element inside the flyout
- Pressing `Escape`
- Clicking the backdrop (outside the panel)
- Calling `closeFlyout('id')` from JavaScript

### Preventing close

```bladehtml

<x-hui::flyout id="locked" :close-on-escape="false" :close-on-backdrop-click="false">
    ...
</x-hui::flyout>
```

### Scroll locking

```bladehtml

<x-hui::flyout id="my-flyout" :scroll-lock="true">
    ...
</x-hui::flyout>
```

### Responsive inline mode (sidebar)

Use the `inline` prop to specify a breakpoint (in pixels). Above this width, the flyout becomes a static sidebar visible
in the document flow. Below it, the flyout behaves as a slide-out panel opened via trigger.

```bladehtml

<div class="flex">
    <x-hui::flyout id="sidebar" position="left" :inline="1024">
        <x-hui::flyout.panel class="w-64 bg-white border-r">
            {{-- Navigation content --}}
        </x-hui::flyout.panel>
    </x-hui::flyout>

    <main class="flex-1">
        <button data-hui-flyout-trigger="sidebar" class="lg:hidden">
            Open menu
        </button>
        {{-- Page content --}}
    </main>
</div>
```

In inline mode:

- The `<dialog>` becomes `display: block; position: static`
- The background is hidden
- The panel becomes `position: static`
- The trigger button can be hidden with responsive utilities (e.g. `lg:hidden`)
- Opening via trigger/JS API is ignored

### Nested flyouts

Flyouts can be nested. Each opens in the browser's top layer, stacking naturally. Escape closes only the topmost flyout,
and focus is restored to the previous one.

```bladehtml

<x-hui::flyout id="parent-flyout" position="right">
    <x-hui::flyout.panel class="w-80 bg-white">
        <button data-hui-flyout-trigger="child-flyout">Open nested</button>
    </x-hui::flyout.panel>
</x-hui::flyout>

<x-hui::flyout id="child-flyout" position="right">
    <x-hui::flyout.panel class="w-64 bg-white">
        <button data-hui-flyout-close>Close</button>
    </x-hui::flyout.panel>
</x-hui::flyout>
```

### JavaScript API

```javascript
import {openFlyout, closeFlyout} from '../../vendor/schaefersoft/laravel-headless-ui/dist/js/hui.js'

openFlyout('my-flyout')
closeFlyout('my-flyout')
```

## Transitions

Add transition attributes to the background and/or panel for animated open/close. Use position-appropriate transforms.

```bladehtml

<x-hui::flyout id="my-flyout" position="right">
    <x-hui::flyout.background class="bg-black/40"
                              data-hui-flyout-enter="transition duration-200 ease-out"
                              data-hui-flyout-enter-from="opacity-0"
                              data-hui-flyout-enter-to="opacity-100"
                              data-hui-flyout-leave="transition duration-150 ease-in"
                              data-hui-flyout-leave-from="opacity-100"
                              data-hui-flyout-leave-to="opacity-0"/>

    <x-hui::flyout.panel class="w-80 h-full bg-white"
                         data-hui-flyout-enter="transition duration-300 ease-out"
                         data-hui-flyout-enter-from="translate-x-full"
                         data-hui-flyout-enter-to="translate-x-0"
                         data-hui-flyout-leave="transition duration-200 ease-in"
                         data-hui-flyout-leave-from="translate-x-0"
                         data-hui-flyout-leave-to="translate-x-full">
        ...
    </x-hui::flyout.panel>
</x-hui::flyout>
```

**Suggested transforms per position:**

| Position | Enter from          | Leave to            |
|----------|---------------------|---------------------|
| `right`  | `translate-x-full`  | `translate-x-full`  |
| `left`   | `-translate-x-full` | `-translate-x-full` |
| `bottom` | `translate-y-full`  | `translate-y-full`  |
| `top`    | `-translate-y-full` | `-translate-y-full` |

## Events

| Event              | When              |
|--------------------|-------------------|
| `hui:flyout:open`  | Flyout has opened |
| `hui:flyout:close` | Flyout has closed |

## Props

### Flyout

| Prop                      | Type      | Default   | Description                                          |
|---------------------------|-----------|-----------|------------------------------------------------------|
| `class`                   | `string`  | `""`      | Custom classes for the flyout.                       |
| `position`                | `string`  | `"right"` | Panel position: `left`, `right`, `top`, `bottom`.    |
| `open`                    | `boolean` | `false`   | Opens the flyout on page load.                       |
| `close-on-escape`         | `boolean` | `true`    | Whether Escape closes the flyout.                    |
| `close-on-backdrop-click` | `boolean` | `true`    | Whether backdrop click closes the flyout.            |
| `scroll-lock`             | `boolean` | `false`   | Locks body scroll while open.                        |
| `inline`                  | `int`     | `null`    | Breakpoint (px) above which the flyout is a sidebar. |

### Panel

| Prop    | Type     | Default | Description                   |
|---------|----------|---------|-------------------------------|
| `class` | `string` | `""`    | Custom classes for the panel. |

### Background

| Prop    | Type     | Default | Description                        |
|---------|----------|---------|------------------------------------|
| `class` | `string` | `""`    | Custom classes for the background. |

### Title

| Prop    | Type     | Default | Description                   |
|---------|----------|---------|-------------------------------|
| `class` | `string` | `""`    | Custom classes for the title. |

> [!NOTE]
> Renders an `<h2/>`. Automatically linked via `aria-labelledby`.

### Description

| Prop    | Type     | Default | Description                         |
|---------|----------|---------|-------------------------------------|
| `class` | `string` | `""`    | Custom classes for the description. |

> [!NOTE]
> Renders a `<p/>`. Automatically linked via `aria-describedby`.

## Accessibility

### Keyboard

| Key         | Action                        |
|-------------|-------------------------------|
| `Escape`    | Close the flyout              |
| `Tab`       | Cycle focus within the flyout |
| `Shift+Tab` | Cycle focus backwards         |

### ARIA

- Uses the native `<dialog>` element with `showModal()` for modal behavior.
- `aria-labelledby` is set automatically from `flyout.title`.
- `aria-describedby` is set automatically from `flyout.description`.
- Focus is trapped inside the flyout while open.
- Focus returns to the triggering element when the flyout closes.
- The background is marked `aria-hidden="true"`.
- In inline mode, the flyout is a static element with no modal behavior.
