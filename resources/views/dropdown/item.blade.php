<div
    data-hui-dropdown-item
    @class(['hui-dropdown-item', $class])
    @if($disabled) data-disabled aria-disabled="true" @endif
    @if($value) data-value="{{ $value }}" @endif
    {{ $attributes->except(['class', 'disabled', 'value']) }}
>
    {{ $slot }}
</div>
