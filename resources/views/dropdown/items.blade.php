<div
    data-hui-dropdown-items
    @class(['hui-dropdown-items', $class])
    {{ $attributes->except(['class']) }}
>
    {{ $slot }}
</div>
