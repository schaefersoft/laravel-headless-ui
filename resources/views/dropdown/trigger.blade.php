<button
    type="button"
    data-hui-dropdown-trigger
    @class(['hui-dropdown-trigger', $class])
    {{ $attributes->except(['class']) }}
>
    {{ $slot }}
</button>
