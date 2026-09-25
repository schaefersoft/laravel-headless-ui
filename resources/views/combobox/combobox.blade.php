<div
    data-hui-combobox
    @class(['hui-combobox', $class])
    @if($multiple) data-hui-combobox-multiple @endif
    @if($disabled) data-hui-combobox-disabled data-disabled @endif
    @if($searchable) data-hui-combobox-searchable @endif
    @if($nullable) data-hui-combobox-nullable @endif
    @if($immediate) data-hui-combobox-immediate @endif
    @if($filter) data-hui-combobox-filter @endif
    @if($inputName) data-hui-combobox-name="{{ $inputName }}" @endif
    data-hui-combobox-value="{{ json_encode($values) }}"
    {{ $attributes->except(['class']) }}
>
    {{ $slot }}

    @if($inputName)
        @if($multiple)
            @foreach($values as $selected)
                <input type="hidden" data-hui-combobox-hidden-input name="{{ $inputName }}" value="{{ $selected }}" @disabled($disabled)>
            @endforeach
        @else
            <input type="hidden" data-hui-combobox-hidden-input name="{{ $inputName }}" value="{{ $values[0] ?? '' }}" @disabled($disabled)>
        @endif
    @endif
</div>
