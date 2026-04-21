<div
    data-hui-dropdown
    @class(['hui-dropdown', $class])
    {{ $attributes->except(['class']) }}
>
    {{ $slot }}
</div>
