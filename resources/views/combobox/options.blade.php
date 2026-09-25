<div
    data-hui-combobox-options
    role="listbox"
    data-hui-combobox-anchor="{{ $anchor }}"
    data-hui-combobox-gap="{{ $gap }}"
    hidden
    @class(['hui-combobox-options', $class])
    {{ $attributes->except(['class']) }}
>
    {{ $slot }}
</div>
