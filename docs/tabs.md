# Tabs

Accessible, headless tabs with keyboard navigation, disabled states, and vertical orientation.

![Tabs example](./assets/tabs/tabs_01.png)

## Usage

Blade components: `x-hui::tabs`, `x-hui::tabs.tablist`, `x-hui::tabs.tab`, `x-hui::tabs.panel`

```bladehtml
<x-hui::tabs :initial-index="1">
  <x-hui::tabs.tablist class="gap-2">
    <x-hui::tabs.tab>Tab 1</x-hui::tabs.tab>
    <x-hui::tabs.tab>Tab 2</x-hui::tabs.tab>
    <x-hui::tabs.tab disabled>Tab 3 (disabled)</x-hui::tabs.tab>
  </x-hui::tabs.tablist>

  <x-hui::tabs.panel>
    Content 1
  </x-hui::tabs.panel>
  <x-hui::tabs.panel>
    Content 2
  </x-hui::tabs.panel>
  <x-hui::tabs.panel>
    Content 3 (won't activate)
  </x-hui::tabs.panel>
</x-hui::tabs>
```

> [!NOTE]
> - Place tabs inside `tabs.tablist` and list `tabs.panel` in the same order.
> - Disable a tab with the `disabled` prop or `data-disabled` attribute.
> - To set an initially active tab, use `:initial-index`, `data-active` on a tab/panel, or the `active` prop. If none is set, the first enabled tab is used.

### Vertical orientation

```bladehtml
<x-hui::tabs :vertical="true">
  <x-hui::tabs.tablist>
    <x-hui::tabs.tab active>General</x-hui::tabs.tab>
    <x-hui::tabs.tab>Billing</x-hui::tabs.tab>
  </x-hui::tabs.tablist>

  <x-hui::tabs.panel>General content</x-hui::tabs.panel>
  <x-hui::tabs.panel>Billing content</x-hui::tabs.panel>
</x-hui::tabs>
```

## Styling

Use `data-active` and `data-disabled` attributes to style tabs and panels.

```bladehtml
<x-hui::tabs.tab class="px-3 py-1.5 text-zinc-500 data-[active]:text-zinc-900 data-[active]:border-b-2 data-[active]:border-zinc-900 data-[disabled]:opacity-50">
    Tab
</x-hui::tabs.tab>
```

## Props

### Tabs

| Prop            | Type      | Default | Description                                                                |
|-----------------|-----------|---------|----------------------------------------------------------------------------|
| `class`         | `string`  | `""`    | Custom classes for the wrapper.                                            |
| `vertical`      | `boolean` | `false` | Sets vertical orientation and ARIA. Changes arrow keys to Up/Down.         |
| `initial-index` | `number`  | `null`  | 0-based initially active index; falls back to first enabled when omitted.  |

> [!NOTE]
> Allows all valid HTML `<div/>` attributes (class, style, data-*, etc.).

### TabList

| Prop    | Type     | Default | Description                             |
|---------|----------|---------|-----------------------------------------|
| `class` | `string` | `""`    | Custom classes for the tablist wrapper.  |

> [!NOTE]
> Allows all valid HTML `<div/>` attributes (class, style, data-*, etc.).

### Tab

| Prop       | Type      | Default | Description                                                      |
|------------|-----------|---------|------------------------------------------------------------------|
| `class`    | `string`  | `""`    | Custom classes for the tab button.                               |
| `active`   | `boolean` | `false` | Marks tab initially active (equivalent to adding `data-active`). |
| `disabled` | `boolean` | `false` | Renders `data-disabled` and `aria-disabled="true"`.              |

> [!NOTE]
> Renders a `<button type="button"/>` and allows all valid HTML `<button/>` attributes.

### Panel

| Prop     | Type      | Default | Description                                             |
|----------|-----------|---------|---------------------------------------------------------|
| `class`  | `string`  | `""`    | Custom classes for the panel.                           |
| `active` | `boolean` | `false` | Optional hint to start this panel active if applicable. |

> [!NOTE]
> Allows all valid HTML `<div/>` attributes (class, style, data-*, etc.).

## Accessibility

### Keyboard

| Key                              | Action                              |
|----------------------------------|-------------------------------------|
| `ArrowLeft` / `ArrowRight`       | Navigate tabs (horizontal mode)     |
| `ArrowUp` / `ArrowDown`          | Navigate tabs (vertical mode)       |
| `Home`                           | Jump to first enabled tab           |
| `End`                            | Jump to last enabled tab            |
| `Enter` / `Space`                | Activate focused tab                |

### ARIA

- The tablist has `role="tablist"` with `aria-orientation` set to `horizontal` or `vertical`.
- Each tab has `role="tab"` with `aria-selected` and `aria-controls` linking to its panel.
- Each panel has `role="tabpanel"` with `aria-labelledby` linking back to its tab.
- The active tab has `tabindex="0"`; inactive and disabled tabs have `tabindex="-1"`.
- Disabled tabs are marked with `aria-disabled="true"`.
