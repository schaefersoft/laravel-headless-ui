<div
    data-hui-combobox-group
    role="group"
    @class(['hui-combobox-group', $class])
    {{ $attributes->except(['class']) }}
>
    @if($label !== null)
        <div data-hui-combobox-group-label @class(['hui-combobox-group-label', $labelClass])>{{ $label }}</div>
    @endif
    {{ $slot }}
</div>
