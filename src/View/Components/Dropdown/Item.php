<?php

namespace Schaefersoft\HeadlessUI\View\Components\Dropdown;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Item extends Component
{
    public function __construct(
        public string $class = '',
        public bool $disabled = false,
        public string $value = '',
    ) {}

    public function render(): View
    {
        return view('hui::dropdown.item');
    }
}
