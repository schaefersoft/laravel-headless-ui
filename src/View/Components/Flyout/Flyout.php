<?php

namespace Schaefersoft\HeadlessUI\View\Components\Flyout;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Flyout extends Component
{
    public function __construct(
        public string $class = '',
        public string $position = 'right',
        public bool $open = false,
        public bool $closeOnEscape = true,
        public bool $closeOnBackdropClick = true,
        public bool $scrollLock = false,
        public ?int $inline = null,
    ) {}

    public function render(): View
    {
        return view('hui::flyout.flyout');
    }
}
