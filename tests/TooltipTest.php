<?php

use Schaefersoft\HeadlessUI\View\Components\Tooltip\Content;

it('renders a tooltip wrapper', function () {
    $view = $this->blade('
        <x-hui::tooltip>
            Trigger
            <x-hui::tooltip.content>Tooltip text</x-hui::tooltip.content>
        </x-hui::tooltip>
    ');

    $view->assertSee('data-hui-tooltip', false);
    $view->assertSee('role="tooltip"', false);
    $view->assertSee('Trigger');
    $view->assertSee('Tooltip text');
});

it('renders open by default', function () {
    $view = $this->blade('
        <x-hui::tooltip open>
            Trigger
            <x-hui::tooltip.content>Content</x-hui::tooltip.content>
        </x-hui::tooltip>
    ');

    $view->assertSee('data-hui-tooltip-open', false);
});

it('renders disabled state', function () {
    $view = $this->blade('
        <x-hui::tooltip disabled>
            Trigger
            <x-hui::tooltip.content>Content</x-hui::tooltip.content>
        </x-hui::tooltip>
    ');

    $view->assertSee('data-hui-tooltip-disabled', false);
});

it('renders arrow by default', function () {
    $view = $this->blade('
        <x-hui::tooltip>
            Trigger
            <x-hui::tooltip.content>Content</x-hui::tooltip.content>
        </x-hui::tooltip>
    ');

    $view->assertSee('data-hui-tooltip-arrow', false);
});

it('renders without arrow when disabled', function () {
    $view = $this->blade('
        <x-hui::tooltip>
            Trigger
            <x-hui::tooltip.content :arrow="false">Content</x-hui::tooltip.content>
        </x-hui::tooltip>
    ');

    $view->assertDontSee('data-hui-tooltip-arrow', false);
});

it('renders position attribute', function () {
    $view = $this->blade('
        <x-hui::tooltip>
            Trigger
            <x-hui::tooltip.content position="bottom">Content</x-hui::tooltip.content>
        </x-hui::tooltip>
    ');

    $view->assertSee('data-hui-tooltip-position="bottom"', false);
});

it('throws on invalid position', function () {
    new Content(position: 'invalid');
})->throws(Exception::class);

it('accepts all valid positions', function (string $position) {
    $content = new Content(position: $position);

    expect($content->position)->toBe($position);
})->with(['top', 'bottom', 'left', 'right']);

it('passes custom classes', function () {
    $view = $this->blade('
        <x-hui::tooltip class="wrapper-class">
            Trigger
            <x-hui::tooltip.content class="content-class">Content</x-hui::tooltip.content>
        </x-hui::tooltip>
    ');

    $view->assertSee('wrapper-class');
    $view->assertSee('content-class');
});
