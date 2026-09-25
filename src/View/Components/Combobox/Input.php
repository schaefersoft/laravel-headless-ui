<?php

namespace Schaefersoft\HeadlessUI\View\Components\Combobox;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Input extends Component
{
    public function __construct(
        public string $class = '',
    ) {}

    public function render(): View
    {
        return view('hui::combobox.input');
    }
}
