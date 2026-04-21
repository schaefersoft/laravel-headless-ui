<dialog
    data-hui-dialog
    @class(['hui-dialog', $class])
    @if($open) data-hui-dialog-open @endif
    @unless($closeOnEscape) data-hui-dialog-no-escape @endunless
    @unless($closeOnBackdropClick) data-hui-dialog-no-backdrop-close @endunless
    @if($scrollLock) data-hui-dialog-scroll-lock @endif
    {{ $attributes->except(['class', 'open', 'closeOnEscape', 'closeOnBackdropClick', 'scrollLock']) }}
>
    {{ $slot }}
</dialog>
