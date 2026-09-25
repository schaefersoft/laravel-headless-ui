<?php

namespace Schaefersoft\HeadlessUI\View\Components\Combobox;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Option extends Component
{
    public function __construct(
        public string|int $value,
        public string $class = '',
        public ?string $label = null,
        public bool $disabled = false,
    ) {}

    public function render(): View
    {
        return view('hui::combobox.option');
    }
}
