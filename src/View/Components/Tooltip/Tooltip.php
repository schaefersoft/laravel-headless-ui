<?php

namespace Schaefersoft\HeadlessUI\View\Components\Tooltip;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Tooltip extends Component
{
    public function __construct(
        public string $class = '',
        public bool $open = false,
        public bool $disabled = false,
    )
    {
    }

    public function render(): View
    {
        return view('hui::tooltip.tooltip');
    }
}
