<?php

namespace Schaefersoft\HeadlessUI\View\Components\Disclosure;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Head extends Component
{
    public function __construct(
        public string $class = '',
    ) {
    }

    public function render(): View
    {
        return view('hui::disclosure.head');
    }
}
