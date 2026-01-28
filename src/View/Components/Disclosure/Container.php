<?php

namespace Schaefersoft\HeadlessUI\View\Components\Disclosure;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Container extends Component
{
    public function __construct(
        public string $class = '',
        public ?int $maxCount = null
    )
    {
    }

    public function render(): View
    {
        return view('hui::disclosure.container');
    }
}
