<div
    data-hui-dialog-panel
    @class(['hui-dialog-panel', $maxWidthClass(), $class])
    {{ $attributes->except(['class', 'maxWidth']) }}
>
    {{ $slot }}
</div>
