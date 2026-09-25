<template data-hui-combobox-custom-option-template>
    <div
        @class(['hui-combobox-option', 'hui-combobox-custom-option', $class])
        {{ $attributes->except(['class']) }}
    >
        @if($slot->isEmpty())
            Create "<span data-hui-combobox-custom-query></span>"
        @else
            {{ $slot }}
        @endif
    </div>
</template>
