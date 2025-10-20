<div data-hui-tooltip-content
     role="tooltip"
     @class(['hui-tooltip-content', $class])
     @if($arrow) data-hui-tooltip-arrow @endif
     style="display: none"
>
    {{$slot}}
</div>
