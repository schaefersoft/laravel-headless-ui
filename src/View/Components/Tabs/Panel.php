<?php

namespace Schaefersoft\HeadlessUI\View\Components\Tabs;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Panel extends Component
{
    public function __construct(
        public string $class = '',
        public bool $active = false,
    ) {
    }

    public function render(): View
    {
        return view('hui::tabs.panel');
    }
}

