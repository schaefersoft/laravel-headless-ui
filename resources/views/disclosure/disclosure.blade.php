<details
    data-hui-disclosure
    role="disclosure"
    @class(['hui-disclosure', $class])
    @if($opened) data-opened="true" open @endif
    @if($disabled) data-disabled="true" @endif
>
    {{$slot}}
</details>

