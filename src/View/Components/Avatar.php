<?php

namespace Schaefersoft\HeadlessUI\View\Components;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Avatar extends Component
{
    public function __construct(
        public ?string $src = null,
        public ?string $name = null,
        public ?string $initials = null,
        public ?string $alt = null,
        public string  $class = ''
    )
    {
        $this->src = $this->src ?: null;
        $this->name = $this->name ?: null;
        $this->initials = $this->initials ?: null;
        $this->alt = $this->alt ?: ($this->name ?? 'User avatar');
    }

    public function computedInitials(): string
    {
        if (!empty($this->initials)) {
            return mb_strtoupper(trim($this->initials));
        }

        $name = trim((string) $this->name);
        if ($name === '') {
            return '?';
        }

        $parts = preg_split('/\s+/u', $name, -1, PREG_SPLIT_NO_EMPTY);
        if (!$parts) {
            return '?';
        }

        $initials = mb_substr($parts[0], 0, 1);
        if (count($parts) > 1) {
            $initials .= mb_substr(end($parts), 0, 1);
        }

        return mb_strtoupper($initials);
    }

    public function render(): View
    {
        return view('hui::avatar.avatar', [
            'computedInitials' => $this->computedInitials(),
        ]);
    }
}
