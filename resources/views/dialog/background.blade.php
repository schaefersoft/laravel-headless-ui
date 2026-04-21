<div
    data-hui-dialog-background
    aria-hidden="true"
    @class(['hui-dialog-background', $class])
    {{ $attributes->except(['class']) }}
>
    {{ $slot }}
</div>
