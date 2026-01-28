<div
    data-hui-disclosure-container
    role="disclosure-container"
    @class(['hui-disclosure-container', $class])
    @if(!is_null($maxCount)) data-max-count="{{$maxCount}}" @endif
>
    {{$slot}}
</div>

