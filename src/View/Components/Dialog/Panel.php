<?php

namespace Schaefersoft\HeadlessUI\View\Components\Dialog;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Panel extends Component
{
    public const MAX_WIDTHS = [
        'sm' => 'max-w-sm',
        'md' => 'max-w-md',
        'lg' => 'max-w-lg',
        'xl' => 'max-w-xl',
        '2xl' => 'max-w-2xl',
        '3xl' => 'max-w-3xl',
        '4xl' => 'max-w-4xl',
        '5xl' => 'max-w-5xl',
        '6xl' => 'max-w-6xl',
        '7xl' => 'max-w-7xl',
        'full' => 'max-w-full',
    ];

    public function __construct(
        public string $class = '',
        public string $maxWidth = '',
    ) {}

    public function maxWidthClass(): string
    {
        return self::MAX_WIDTHS[$this->maxWidth] ?? '';
    }

    public function render(): View
    {
        return view('hui::dialog.panel');
    }
}
