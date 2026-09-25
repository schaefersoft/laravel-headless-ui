<?php

namespace Schaefersoft\HeadlessUI\View\Components\Combobox;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Group extends Component
{
    public function __construct(
        public string $class = '',
        public ?string $label = null,
        public string $labelClass = '',
    ) {}

    public function render(): View
    {
        return view('hui::combobox.group');
    }
}
