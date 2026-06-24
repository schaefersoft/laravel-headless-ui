<?php

it('renders a dialog element', function () {
    $view = $this->blade('
        <x-hui::flyout id="test-flyout">
            <x-hui::flyout.panel>Content</x-hui::flyout.panel>
        </x-hui::flyout>
    ');

    $view->assertSee('<dialog', false);
    $view->assertSee('data-hui-flyout', false);
    $view->assertSee('id="test-flyout"', false);
    $view->assertSee('Content');
});

it('defaults to the right position', function () {
    $view = $this->blade('<x-hui::flyout id="test-flyout">x</x-hui::flyout>');

    $view->assertSee('data-hui-flyout-position="right"', false);
});

it('does not emit a swipe attribute by default', function () {
    $view = $this->blade('<x-hui::flyout id="test-flyout">x</x-hui::flyout>');

    $view->assertDontSee('data-hui-flyout-swipe', false);
});

it('enables both swipe directions when swipe is set as a boolean', function () {
    $view = $this->blade('<x-hui::flyout id="test-flyout" swipe>x</x-hui::flyout>');

    $view->assertSee('data-hui-flyout-swipe="both"', false);
});

it('enables only swipe-to-close with swipe="close"', function () {
    $view = $this->blade('<x-hui::flyout id="test-flyout" swipe="close">x</x-hui::flyout>');

    $view->assertSee('data-hui-flyout-swipe="close"', false);
});

it('enables only swipe-to-open with swipe="open"', function () {
    $view = $this->blade('<x-hui::flyout id="test-flyout" swipe="open">x</x-hui::flyout>');

    $view->assertSee('data-hui-flyout-swipe="open"', false);
});

it('omits the swipe attribute when swipe is explicitly false', function () {
    $view = $this->blade('<x-hui::flyout id="test-flyout" :swipe="false">x</x-hui::flyout>');

    $view->assertDontSee('data-hui-flyout-swipe', false);
});

it('emits a scoped media query for inline mode at the configured breakpoint', function () {
    $view = $this->blade('
        <x-hui::flyout id="sidebar" :inline="1024">
            <x-hui::flyout.panel>Nav</x-hui::flyout.panel>
        </x-hui::flyout>
    ');

    $view->assertSee('data-hui-flyout-inline="1024"', false);
    $view->assertSee('<style>', false);
    $view->assertSee('@media (min-width: 1024px)', false);
    $view->assertSee('#sidebar', false);
});

it('does not emit a style block when inline mode is off', function () {
    $view = $this->blade('<x-hui::flyout id="test-flyout">x</x-hui::flyout>');

    $view->assertDontSee('<style', false);
    $view->assertDontSee('@media', false);
});

it('generates an id to scope the inline media query when none is supplied', function () {
    $view = $this->blade('<x-hui::flyout :inline="768">x</x-hui::flyout>');

    $view->assertSee('id="hui-flyout-', false);
    $view->assertSee('#hui-flyout-', false);
    $view->assertSee('@media (min-width: 768px)', false);
});
