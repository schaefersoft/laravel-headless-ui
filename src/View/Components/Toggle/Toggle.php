<?php

namespace Schaefersoft\HeadlessUI\View\Components\Toggle;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Toggle extends Component
{
    public function __construct(
        public string $class = '',
        public bool $checked = false,
        public bool $disabled = false,
        public ?string $name = null,
        public ?string $value = '1'
    )
    {
    }

    public function render(): View
    {
        return view('hui::toggle.toggle');
    }
}
