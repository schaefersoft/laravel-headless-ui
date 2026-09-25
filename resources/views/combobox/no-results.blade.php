<div
    data-hui-combobox-no-results
    hidden
    @class(['hui-combobox-no-results', $class])
    {{ $attributes->except(['class']) }}
>
    {{ $slot }}
</div>
