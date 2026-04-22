<div
    data-hui-flyout-background
    aria-hidden="true"
    @class(['hui-flyout-background', $class])
    {{ $attributes->except(['class']) }}
>
    {{ $slot }}
</div>
