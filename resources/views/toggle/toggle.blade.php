<div data-hui-toggle
     @class(['hui-toggle', $class])
     role="switch"
     tabindex="{{ $disabled ? '-1' : '0' }}"
     aria-checked="{{ $checked ? 'true' : 'false' }}"
     aria-disabled="{{ $disabled ? 'true' : 'false' }}"
    {{$attributes->except(['name','checked','disabled'])}}>

    {{$slot}}

    @if($name)
        <input type="checkbox"
               class="hui-toggle-input"
               name="{{ $name }}"
               @checked($checked)
               @disabled($disabled)
               hidden>
    @endif

</div>
