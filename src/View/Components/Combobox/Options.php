<?php

namespace Schaefersoft\HeadlessUI\View\Components\Combobox;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Options extends Component
{
    public function __construct(
        public string $class = '',
        public string $anchor = 'bottom start',
        public int $gap = 4,
    )
    {
        $this->anchor = strtolower(trim(preg_replace('/\s+/', ' ', $this->anchor)));

        $parts = explode(' ', $this->anchor);
        $side = $parts[0];
        $align = $parts[1] ?? null;

        if (count($parts) > 2 || !in_array($side, ['top', 'bottom'], true) || !in_array($align, [null, 'start', 'end'], true)) {
            throw new \Exception("Invalid anchor '{$this->anchor}' provided. Use 'top' or 'bottom', optionally followed by 'start' or 'end'.");
        }
    }

    public function render(): View
    {
        return view('hui::combobox.options');
    }
}
