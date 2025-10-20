<div
    data-hui-tabs
    @class(['hui-tabs', $class])
    @if($vertical) data-hui-tabs-orientation="vertical" @endif
    @if(!is_null($initialIndex)) data-hui-tabs-initial-index="{{$initialIndex}}" @endif
>
    {{$slot}}
</div>

