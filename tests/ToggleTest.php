<?php

it('renders a switch role', function () {
    $view = $this->blade('
        <x-hui::toggle>
            <x-hui::toggle.thumb/>
        </x-hui::toggle>
    ');

    $view->assertSee('role="switch"', false);
    $view->assertSee('aria-checked="false"', false);
    $view->assertSee('aria-disabled="false"', false);
    $view->assertSee('tabindex="0"', false);
});

it('renders checked state', function () {
    $view = $this->blade('
        <x-hui::toggle checked>
            <x-hui::toggle.thumb/>
        </x-hui::toggle>
    ');

    $view->assertSee('aria-checked="true"', false);
});

it('renders disabled state', function () {
    $view = $this->blade('
        <x-hui::toggle disabled>
            <x-hui::toggle.thumb/>
        </x-hui::toggle>
    ');

    $view->assertSee('aria-disabled="true"', false);
    $view->assertSee('tabindex="-1"', false);
});

it('renders hidden checkbox when name is set', function () {
    $view = $this->blade('
        <x-hui::toggle name="my_toggle" checked>
            <x-hui::toggle.thumb/>
        </x-hui::toggle>
    ');

    $view->assertSee('name="my_toggle"', false);
    $view->assertSee('type="checkbox"', false);
    $view->assertSee('checked', false);
});

it('does not render hidden checkbox when name is not set', function () {
    $view = $this->blade('
        <x-hui::toggle>
            <x-hui::toggle.thumb/>
        </x-hui::toggle>
    ');

    $view->assertDontSee('type="checkbox"', false);
});

it('renders thumb with aria-hidden', function () {
    $view = $this->blade('
        <x-hui::toggle>
            <x-hui::toggle.thumb/>
        </x-hui::toggle>
    ');

    $view->assertSee('aria-hidden="true"', false);
    $view->assertSee('hui-toggle-thumb');
});

it('passes custom classes', function () {
    $view = $this->blade('
        <x-hui::toggle class="toggle-class">
            <x-hui::toggle.thumb class="thumb-class"/>
        </x-hui::toggle>
    ');

    $view->assertSee('toggle-class');
    $view->assertSee('thumb-class');
});
