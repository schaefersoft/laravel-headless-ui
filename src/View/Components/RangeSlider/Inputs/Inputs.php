<?php

namespace Schaefersoft\HeadlessUI\View\Components\RangeSlider\Inputs;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Inputs extends Component
{
    public function __construct(
        public string $class = '',
        public string $minClass = '',
        public string $maxClass = ''
    )
    {
    }

    public function render(): View
    {
        return view('hui::range-slider.inputs.inputs');
    }
}

