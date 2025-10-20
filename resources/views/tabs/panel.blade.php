<div
    data-hui-tabpanel
    role="tabpanel"
    @class(['hui-tabpanel', $class])
    @if($active) data-active @endif
>
    {{$slot}}
</div>

