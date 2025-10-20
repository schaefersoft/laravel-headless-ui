<?php

namespace Schaefersoft\HeadlessUI\View\Components\Tabs;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Tabs extends Component
{
    public function __construct(
        public string $class = '',
        public bool $vertical = false,
        public ?int $initialIndex = null,
    ) {
    }

    public function render(): View
    {
        return view('hui::tabs.tabs');
    }
}

