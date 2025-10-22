<?php

namespace Schaefersoft\HeadlessUI\View\Components\Slider;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Thumb extends Component
{
    public function __construct(
        public string  $class = ''
    )
    {
    }

    public function render(): View
    {
        return view('hui::slider.thumb');
    }
}
