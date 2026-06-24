@php
    $flyoutId = $attributes->get('id');
    if ($inline && ! $flyoutId) {
        $flyoutId = 'hui-flyout-'.\Illuminate\Support\Str::random(8);
    }
@endphp

<dialog
    @if($flyoutId) id="{{ $flyoutId }}" @endif
    data-hui-flyout
    data-hui-flyout-position="{{ $position }}"
    @class(['hui-flyout', "hui-flyout-{$position}", $class])
    @if($open) data-hui-flyout-open @endif
    @unless($closeOnEscape) data-hui-flyout-no-escape @endunless
    @unless($closeOnBackdropClick) data-hui-flyout-no-backdrop-close @endunless
    @if($scrollLock) data-hui-flyout-scroll-lock @endif
    @if($inline) data-hui-flyout-inline="{{ $inline }}" @endif
    @if($swipeMode()) data-hui-flyout-swipe="{{ $swipeMode() }}" @endif
    {{ $attributes->except(['class', 'open', 'position', 'closeOnEscape', 'closeOnBackdropClick', 'scrollLock', 'inline', 'swipe', 'id']) }}
>
    {{ $slot }}
</dialog>

@if($inline)
    <style>
        @media (min-width: {{ $inline }}px) {
            #{{ $flyoutId }} {
                display: block;
                position: static;
                overflow: visible;
            }

            #{{ $flyoutId }} .hui-flyout-panel {
                position: static;
                overflow-y: visible;
            }

            #{{ $flyoutId }} .hui-flyout-background {
                display: none;
            }
        }
    </style>
@endif
