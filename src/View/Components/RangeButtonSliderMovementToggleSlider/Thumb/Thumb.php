<?php

namespace Schaefersoft\HeadlessUI\View\Components\RangeSlider\Thumb;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;
use InvalidArgumentException;
use Schaefersoft\HeadlessUI\Enums\RangeSlider\ThumbRole;

class Thumb extends Component
{
    public function __construct(
        public ThumbRole | string $role,
        public string $class = ''
    )
    {
        if ($this->role instanceof ThumbRole) {
            $this->role = $this->role->value;
        }

        if (!in_array($this->role, ['min', 'max'], true)) {
            throw new InvalidArgumentException("Invalid role for range slider thumb: $this->role");
        }
    }

    public function render(): View
    {
        return view('hui::range-slider.thumb.thumb');
    }
}

