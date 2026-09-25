<button
    type="button"
    tabindex="-1"
    data-hui-combobox-clear
    hidden
    @class(['hui-combobox-clear', $class])
    {{ $attributes->merge(['aria-label' => 'Clear selection'])->except(['class']) }}
>
    {{ $slot }}
</button>
