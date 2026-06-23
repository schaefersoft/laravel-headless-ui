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
