<?php

namespace Schaefersoft\HeadlessUI\View\Components\Dropdown;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Items extends Component
{
    public function __construct(
        public string $class = '',
    ) {}

    public function render(): View
    {
        return view('hui::dropdown.items');
    }
}
