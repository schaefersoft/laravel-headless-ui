<div
    data-hui-combobox-option
    role="option"
    aria-selected="false"
    data-value="{{ $value }}"
    @if($label !== null) data-label="{{ $label }}" @endif
    @if($disabled) data-disabled aria-disabled="true" @endif
    @class(['hui-combobox-option', $class])
    {{ $attributes->except(['class']) }}
>
    {{ $slot }}
</div>
