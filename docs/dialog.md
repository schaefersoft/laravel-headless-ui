# Dialog

An accessible modal dialog built on the native `<dialog>` element. Includes focus trapping, scroll locking, backdrop click, and Escape to close.

## Usage

Blade components: `x-hui::dialog`, `x-hui::dialog.overlay`, `x-hui::dialog.panel`, `x-hui::dialog.title`, `x-hui::dialog.description`

### Opening via trigger button

Use `data-hui-dialog-trigger` on any button to open a dialog by its `id`. Multiple triggers can reference the same dialog.

```bladehtml
<button data-hui-dialog-trigger="confirm-dialog">Delete item</button>

<x-hui::dialog id="confirm-dialog">
    <x-hui::dialog.overlay/>

    <x-hui::dialog.panel>
        <x-hui::dialog.title>Delete item?</x-hui::dialog.title>
        <x-hui::dialog.description>This action cannot be undone.</x-hui::dialog.description>

        <button data-hui-dialog-close>Cancel</button>
        <button data-hui-dialog-close>Confirm</button>
    </x-hui::dialog.panel>
</x-hui::dialog>
```

### Opening via JavaScript API

```javascript
import { openDialog, closeDialog } from '../../vendor/schaefersoft/laravel-headless-ui/dist/js/hui.js'

openDialog('confirm-dialog')
closeDialog('confirm-dialog')
```

### Closing the dialog

The dialog can be closed in several ways:

- Click a `data-hui-dialog-close` element inside the dialog
- Press `Escape`
- Click the overlay / backdrop (outside the panel)
- Call `closeDialog('id')` from JavaScript

### Open by default

```bladehtml
<x-hui::dialog id="welcome-dialog" open>
    <x-hui::dialog.panel>
        <x-hui::dialog.title>Welcome!</x-hui::dialog.title>
        <button data-hui-dialog-close>Got it</button>
    </x-hui::dialog.panel>
</x-hui::dialog>
```

### Events

The dialog emits custom events on the `<dialog>` element:

| Event              | When                  |
|--------------------|-----------------------|
| `hui:dialog:open`  | Dialog has opened     |
| `hui:dialog:close` | Dialog has closed     |

```javascript
document.getElementById('confirm-dialog')
    .addEventListener('hui:dialog:close', () => {
        console.log('Dialog was closed')
    })
```

## Styling

The dialog renders as a native `<dialog>` with all default styles reset (no padding, no border, transparent background). The overlay is a fixed full-screen `<div>`. Style everything with your own classes.

```bladehtml
<x-hui::dialog id="my-dialog">
    <x-hui::dialog.overlay class="bg-black/50"/>

    <x-hui::dialog.panel class="mx-auto mt-20 max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <x-hui::dialog.title class="text-lg font-semibold">Title</x-hui::dialog.title>
        <x-hui::dialog.description class="mt-2 text-sm text-zinc-600">Description</x-hui::dialog.description>

        <div class="mt-4 flex justify-end gap-2">
            <button data-hui-dialog-close class="rounded px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100">Cancel</button>
            <button data-hui-dialog-close class="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700">Delete</button>
        </div>
    </x-hui::dialog.panel>
</x-hui::dialog>
```

> [!NOTE]
> The native `<dialog>` element renders in the browser's top layer, so there are no z-index issues with other content.

## Props

### Dialog

| Prop    | Type      | Default | Description                                        |
|---------|-----------|---------|----------------------------------------------------|
| `class` | `string`  | `""`    | Custom classes for the dialog.                     |
| `open`  | `boolean` | `false` | Opens the dialog on page load.                     |

> [!NOTE]
> Renders a native `<dialog/>` element. Requires an `id` attribute for trigger binding and JS API. Allows all valid HTML `<dialog/>` attributes.

### Overlay

| Prop    | Type     | Default | Description                      |
|---------|----------|---------|----------------------------------|
| `class` | `string` | `""`    | Custom classes for the overlay.  |

> [!NOTE]
> Renders a `<div/>` with `aria-hidden="true"`. Clicking the overlay closes the dialog.

### Panel

| Prop    | Type     | Default | Description                    |
|---------|----------|---------|--------------------------------|
| `class` | `string` | `""`    | Custom classes for the panel.  |

> [!NOTE]
> Allows all valid HTML `<div/>` attributes (class, style, data-*, etc.).

### Title

| Prop    | Type     | Default | Description                    |
|---------|----------|---------|--------------------------------|
| `class` | `string` | `""`    | Custom classes for the title.  |

> [!NOTE]
> Renders an `<h2/>`. Automatically linked to the dialog via `aria-labelledby`.

### Description

| Prop    | Type     | Default | Description                          |
|---------|----------|---------|--------------------------------------|
| `class` | `string` | `""`    | Custom classes for the description.  |

> [!NOTE]
> Renders a `<p/>`. Automatically linked to the dialog via `aria-describedby`.

## Accessibility

### Keyboard

| Key      | Action                            |
|----------|-----------------------------------|
| `Escape` | Close the dialog                  |
| `Tab`    | Cycle focus within the dialog     |
| `Shift+Tab` | Cycle focus backwards          |

### ARIA

- The dialog uses the native `<dialog>` element which provides `role="dialog"` and `aria-modal="true"` automatically.
- `aria-labelledby` is set automatically from `dialog.title`.
- `aria-describedby` is set automatically from `dialog.description`.
- Focus is trapped inside the dialog while open.
- When the dialog closes, focus returns to the element that was focused before opening.
- The overlay is marked `aria-hidden="true"`.
