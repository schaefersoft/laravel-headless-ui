<?php

namespace Schaefersoft\HeadlessUI\View\Components\Dialog;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Description extends Component
{
    public function __construct(
        public string $class = '',
    ) {}

    public function render(): View
    {
        return view('hui::dialog.description');
    }
}
