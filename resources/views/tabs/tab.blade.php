<button
    type="button"
    data-hui-tab
    @class(['hui-tab', $class])
    @if($active) data-active data-activa @endif
    @if($disabled) data-disabled aria-disabled="true" @endif
>
    {{$slot}}
</button>

