<div data-hui-slider
     @class(['hui-slider', $class])
     role="switch"
     tabindex="{{ $disabled ? '-1' : '0' }}"
     aria-checked="{{ $checked ? 'true' : 'false' }}"
     aria-disabled="{{ $disabled ? 'true' : 'false' }}"
     {{$attributes->except(['name','value','checked','disabled'])}}>

    {{$slot}}

    @if($name)
        <input type="checkbox"
               class="hui-slider-input"
               name="{{ $name }}"
               value="{{ $value ?? '1' }}"
               @checked($checked)
               @disabled($disabled)
               hidden>
    @endif

</div>
