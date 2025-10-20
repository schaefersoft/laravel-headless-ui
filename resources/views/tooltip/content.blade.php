<div data-hui-tooltip-content
     role="tooltip"
     @class(['hui-tooltip-content', $class])
     data-hui-tooltip-position="{{$position}}"
     @if($arrow) data-hui-tooltip-arrow @endif
     style="display: none"
>
    {{$slot}}
</div>
