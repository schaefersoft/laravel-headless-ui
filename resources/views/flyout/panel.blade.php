<div
    data-hui-flyout-panel
    @class(['hui-flyout-panel', $maxWidthClass(), $class])
    {{ $attributes->except(['class', 'maxWidth']) }}
>
    {{ $slot }}
</div>
