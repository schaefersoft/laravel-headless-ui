<?php

namespace Schaefersoft\HeadlessUI\View\Components\Disclosure;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Disclosure extends Component
{
    public function __construct(
        public string $class = '',
        public bool $opened = false,
        public bool $disabled = false,
    ) {
    }

    public function render(): View
    {
        return view('hui::disclosure.disclosure');
    }
}
