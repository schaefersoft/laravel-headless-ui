<?php

namespace Schaefersoft\HeadlessUI\View\Components\Tabs;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class TabList extends Component
{
    public function __construct(
        public string $class = '',
    ) {
    }

    public function render(): View
    {
        return view('hui::tabs.tablist');
    }
}

