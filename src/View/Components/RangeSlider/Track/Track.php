<?php

namespace Schaefersoft\HeadlessUI\View\Components\RangeSlider\Track;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Track extends Component
{
    public function __construct(
        public string $class = ''
    )
    {
    }

    public function render(): View
    {
        return view('hui::range-slider.track.track');
    }
}
