# Dropdown Menu

An accessible dropdown menu with keyboard navigation, type-ahead search, and automatic positioning.

![Dropdown example](./assets/dropdown/dropdown_01.png)

## Usage

Blade components: `x-hui::dropdown`, `x-hui::dropdown.trigger`, `x-hui::dropdown.items`, `x-hui::dropdown.item`, `x-hui::dropdown.separator`

### Basic dropdown

```bladehtml
<x-hui::dropdown id="actions">
    <x-hui::dropdown.trigger>Actions</x-hui::dropdown.trigger>

    <x-hui::dropdown.items>
        <x-hui::dropdown.item value="edit">Edit</x-hui::dropdown.item>
        <x-hui::dropdown.item value="duplicate">Duplicate</x-hui::dropdown.item>
        <x-hui::dropdown.separator/>
        <x-hui::dropdown.item value="delete">Delete</x-hui::dropdown.item>
    </x-hui::dropdown.items>
</x-hui::dropdown>
```

### Disabled items

```bladehtml
<x-hui::dropdown.item :disabled="true" value="transfer">Transfer (unavailable)</x-hui::dropdown.item>
```

Disabled items are skipped during keyboard navigation and cannot be selected.

### Handling selection

Listen to the `hui:dropdown:select` event on the dropdown. The selected value is available in `event.detail.value`.

```javascript
document.getElementById('actions')
    .addEventListener('hui:dropdown:select', (e) => {
        console.log('Selected:', e.detail.value)
    })
```

### Opening via JavaScript API

```javascript
import { openDropdown, closeDropdown } from '../../vendor/schaefersoft/laravel-headless-ui/dist/js/hui.js'

openDropdown('actions')
closeDropdown('actions')
```

### Closing the dropdown

The dropdown closes when:

- Clicking an item
- Clicking outside the dropdown
- Pressing `Escape`
- Pressing `Tab`

## Transitions

Add enter/leave transition classes to the items container.

```bladehtml
<x-hui::dropdown.items
    data-hui-dropdown-enter="transition duration-100 ease-out"
    data-hui-dropdown-enter-from="opacity-0 scale-95"
    data-hui-dropdown-enter-to="opacity-100 scale-100"
    data-hui-dropdown-leave="transition duration-75 ease-in"
    data-hui-dropdown-leave-from="opacity-100 scale-100"
    data-hui-dropdown-leave-to="opacity-0 scale-95">
    ...
</x-hui::dropdown.items>
```

| Attribute                       | Description                                      |
|---------------------------------|--------------------------------------------------|
| `data-hui-dropdown-enter`       | Classes applied during the entire enter phase.   |
| `data-hui-dropdown-enter-from`  | Starting state (applied on first frame).         |
| `data-hui-dropdown-enter-to`    | Ending state (swapped in on the next frame).     |
| `data-hui-dropdown-leave`       | Classes applied during the entire leave phase.   |
| `data-hui-dropdown-leave-from`  | Starting state of the leave transition.          |
| `data-hui-dropdown-leave-to`    | Ending state (swapped in on the next frame).     |

## Styling

The dropdown is completely unstyled. The items container is positioned with `position: fixed` and automatically placed below the trigger (or above if there isn't enough space). Use the `data-active` attribute on items to style the highlighted state.

```bladehtml
<x-hui::dropdown.items class="min-w-48 bg-white border border-zinc-200 rounded-md shadow-lg py-1">
    <x-hui::dropdown.item class="px-3 py-2 text-sm text-zinc-700 data-[active]:bg-green-500 data-[active]:text-white cursor-pointer">
        Edit
    </x-hui::dropdown.item>
</x-hui::dropdown.items>
```

The items container receives a `data-placement` attribute (`top` or `bottom`) that can be used for placement-aware styling.

## Events

| Event                    | When                          | Detail                  |
|--------------------------|-------------------------------|-------------------------|
| `hui:dropdown:open`      | Dropdown has opened           | —                       |
| `hui:dropdown:close`     | Dropdown has closed           | —                       |
| `hui:dropdown:select`    | An item was selected          | `{ value: string }`    |

## Props

### Dropdown

| Prop    | Type     | Default | Description                        |
|---------|----------|---------|------------------------------------|
| `class` | `string` | `""`    | Custom classes for the container.  |

> [!NOTE]
> Renders a `<div/>`. Use the `id` attribute for the JavaScript API.

### Trigger

| Prop    | Type     | Default | Description                       |
|---------|----------|---------|-----------------------------------|
| `class` | `string` | `""`    | Custom classes for the trigger.   |

> [!NOTE]
> Renders a `<button type="button"/>` with `aria-haspopup` and `aria-expanded` set automatically.

### Items

| Prop    | Type     | Default | Description                              |
|---------|----------|---------|------------------------------------------|
| `class` | `string` | `""`    | Custom classes for the items container.  |

> [!NOTE]
> Renders a `<div role="menu"/>`. Positioned with `position: fixed` and auto-placed relative to the trigger.

### Item

| Prop       | Type      | Default | Description                           |
|------------|-----------|---------|---------------------------------------|
| `class`    | `string`  | `""`    | Custom classes for the item.          |
| `disabled` | `boolean` | `false` | Disables the item.                    |
| `value`    | `string`  | `""`    | Value sent in the select event.       |

> [!NOTE]
> Renders a `<div role="menuitem"/>`. Receives `data-active` when highlighted via keyboard or hover.

### Separator

| Prop    | Type     | Default | Description                          |
|---------|----------|---------|--------------------------------------|
| `class` | `string` | `""`    | Custom classes for the separator.    |

> [!NOTE]
> Renders a `<div role="separator"/>`.

## Accessibility

### Keyboard

| Key          | Action                                        |
|--------------|-----------------------------------------------|
| `ArrowDown`  | Open dropdown / move to next item             |
| `ArrowUp`    | Open dropdown (last item) / move to prev item |
| `Home`       | Move to first item                            |
| `End`        | Move to last item                             |
| `Enter`      | Select active item / open dropdown             |
| `Space`      | Select active item / open dropdown             |
| `Escape`     | Close dropdown                                |
| `Tab`        | Close dropdown                                |
| Type a letter | Jump to first matching item (type-ahead)      |

### ARIA

- Trigger has `role="button"`, `aria-haspopup="true"`, `aria-expanded`, and `aria-controls`.
- Items container has `role="menu"`.
- Each item has `role="menuitem"`.
- Disabled items have `aria-disabled="true"`.
- Focus is managed programmatically — the active item receives focus and `data-active`.
- Focus returns to the trigger when the dropdown closes.
