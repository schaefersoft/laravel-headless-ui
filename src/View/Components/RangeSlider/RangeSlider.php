<?php

namespace Schaefersoft\HeadlessUI\View\Components\RangeSlider;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class RangeSlider extends Component
{
    public function __construct()
    {
    }

    public function render(): View
    {
        return view('hui::range-slider.range-slider');
    }
}
