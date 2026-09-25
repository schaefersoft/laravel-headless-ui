<button
    type="button"
    tabindex="-1"
    data-hui-combobox-button
    @class(['hui-combobox-button', $class])
    {{ $attributes->except(['class']) }}
>
    {{ $slot }}
</button>
