# Tabs

Accessible, headless tabs with keyboard support, disabled states, vertical orientation, and an initial index.

Blade component namespace: `x-hui::tabs.*`.

![Tooltip example](./assets/tabs/tabs_01.png)

## Usage

```bladehtml
<x-hui::tabs :initial-index="1">
  <x-hui::tabs.tablist class="gap-2">
    <x-hui::tabs.tab>Tab 1</x-hui::tabs.tab>
    <x-hui::tabs.tab>Tab 2</x-hui::tabs.tab>
    <x-hui::tabs.tab data-disabled>Tab 3 (disabled)</x-hui::tabs.tab>
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

Vertical orientation:

```bladehtml
<x-hui::tabs :vertical="true">
  <x-hui::tabs.tablist>
    <x-hui::tabs.tab data-active>General</x-hui::tabs.tab>
    <x-hui::tabs.tab>Billing</x-hui::tabs.tab>
  </x-hui::tabs.tablist>

  <x-hui::tabs.panel>General content</x-hui::tabs.panel>
  <x-hui::tabs.panel>Billing content</x-hui::tabs.panel>
</x-hui::tabs>
```

Notes:

- Place tabs inside `tabs.tablist`; list `tabs.panel` in the same order.
- Disable a tab with `data-disabled`.
- To start active, mark a tab or panel with `data-active` or pass `:initial-index`. If neither is set, the first enabled tab is used.
- Vertical mode uses Up/Down keys; horizontal uses Left/Right. `Home` and `End` jump to first/last enabled; `Enter`/`Space` activate.

Styling:
- The tabs can be styled thorough the `data-active` and `data-disabled` attributes.

## Props

### Tabs

| Prop            | Type      | Default | Description                                                                 |
|-----------------|-----------|---------|-----------------------------------------------------------------------------|
| `class`         | `string`  | `""`    | Custom classes for the wrapper.                                             |
| `vertical`      | `boolean` | `false` | Sets vertical orientation and ARIA. Changes arrow keys to Up/Down.         |
| `initial-index` | `number`  | `null`  | 0-based initially active index; falls back to first enabled when omitted.  |

> [!NOTE]
> Allows all valid HTML `<div/>` attributes (class, style, data-*, etc.).

### TabList

| Prop     | Type     | Default | Description                            |
|----------|----------|---------|----------------------------------------|
| `class`  | `string` | `""`    | Custom classes for the tablist wrapper.|

> [!NOTE]
> Allows all valid HTML `<div/>` attributes (class, style, data-*, etc.).

### Tab

| Prop        | Type      | Default | Description                                                     |
|-------------|-----------|---------|-----------------------------------------------------------------|
| `class`     | `string`  | `""`    | Custom classes for the tab button.                              |
| `active`    | `boolean` | `false` | Marks tab initially active (equivalent to adding `data-active`).|
| `disabled`  | `boolean` | `false` | Renders `data-disabled` and `aria-disabled="true"`.            |

> [!NOTE]
> Renders a `<button type="button"/>` and allows all valid HTML `<button/>` attributes.

### Panel

| Prop     | Type      | Default | Description                                              |
|----------|-----------|---------|----------------------------------------------------------|
| `class`  | `string`  | `""`    | Custom classes for the panel.                            |
| `active` | `boolean` | `false` | Optional hint to start this panel active if applicable.  |

> [!NOTE]
> Allows all valid HTML `<div/>` attributes (class, style, data-*, etc.).

## Keyboard

- Horizontal: Left/Right/End/Home; Enter/Space activate.
- Vertical: Up/Down/End/Home; Enter/Space activate.
