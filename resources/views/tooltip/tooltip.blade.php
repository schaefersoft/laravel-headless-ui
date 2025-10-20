<div data-hui-tooltip
     @class(['hui-tooltip', $class])
     @if($open) data-hui-tooltip-open @endif
     @if($disabled) data-hui-tooltip-disabled @endif
>
    {{$slot}}
</div>
