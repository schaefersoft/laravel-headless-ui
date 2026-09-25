<div
    data-hui-combobox-chips
    @class(['hui-combobox-chips', $class])
    {{ $attributes->except(['class']) }}
>
    @if($slot->isNotEmpty())
        <template data-hui-combobox-chip-template>{{ $slot }}</template>
    @endif
</div>
