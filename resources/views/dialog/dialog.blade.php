<dialog
    data-hui-dialog
    @class(['hui-dialog', $class])
    @if($open) data-hui-dialog-open @endif
    {{ $attributes->except(['class', 'open']) }}
>
    {{ $slot }}
</dialog>
