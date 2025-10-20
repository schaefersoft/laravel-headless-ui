<?php

namespace Schaefersoft\HeadlessUI\View\Components\Tooltip;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Content extends Component
{
    public function __construct(
        public string $class = ''
    )
    {
    }

    public function render(): View
    {
        return view('hui::tooltip.content');
    }
}

