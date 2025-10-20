<?php

namespace Schaefersoft\HeadlessUI\View\Components\Tooltip;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Content extends Component
{
    public function __construct(
        public string $class = '',
        public bool $arrow = true,
        public string $position = 'top',
    )
    {
        $this->position = strtoLower($this->position);

        if (!in_array($this->position, ['top', 'bottom', 'left', 'right'], true)) {
            throw new \Exception("Invalid position '{$this->position}' provided. TOP, BOTTOM, LEFT, RIGHT are supported.");
        }
    }

    public function render(): View
    {
        return view('hui::tooltip.content');
    }
}
