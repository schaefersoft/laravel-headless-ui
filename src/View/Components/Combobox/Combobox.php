<?php

namespace Schaefersoft\HeadlessUI\View\Components\Combobox;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Combobox extends Component
{
    public array $values;

    public ?string $inputName;

    public function __construct(
        public string $class = '',
        public ?string $name = null,
        public mixed $value = null,
        public bool $multiple = false,
        public bool $disabled = false,
        public bool $searchable = true,
        public bool $nullable = false,
        public bool $immediate = false,
        public bool $open = false,
        public bool $filter = true,
    )
    {
        $values = $value instanceof Arrayable ? $value->toArray() : (array) $value;

        $this->values = array_values(array_map(
            'strval',
            array_filter($values, fn ($v) => $v !== null && $v !== ''),
        ));

        if (!$this->multiple) {
            $this->values = array_slice($this->values, 0, 1);
        }

        $this->inputName = $name !== null && $multiple && !str_ends_with($name, '[]')
            ? $name . '[]'
            : $name;
    }

    public function render(): View
    {
        return view('hui::combobox.combobox');
    }
}
