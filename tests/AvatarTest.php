<?php

use Schaefersoft\HeadlessUI\View\Components\Avatar\Avatar;

it('renders an image when src is provided', function () {
    $view = $this->blade('<x-hui::avatar src="https://example.com/img.png" name="Jane Doe" />');

    $view->assertSee('https://example.com/img.png');
    $view->assertSee('Jane Doe'); // alt text
});

it('shows initials when no src is provided', function () {
    $view = $this->blade('<x-hui::avatar name="Jane Doe" />');

    $view->assertSee('JD');
    $view->assertDontSee('<img', false);
});

it('computes initials from first and last name', function () {
    $avatar = new Avatar(name: 'John Michael Smith');

    expect($avatar->computedInitials())->toBe('JS');
});

it('computes single initial from single name', function () {
    $avatar = new Avatar(name: 'Jane');

    expect($avatar->computedInitials())->toBe('J');
});

it('uses explicit initials over computed ones', function () {
    $avatar = new Avatar(name: 'Jane Doe', initials: 'XY');

    expect($avatar->computedInitials())->toBe('XY');
});

it('falls back to ? when no name or initials provided', function () {
    $avatar = new Avatar();

    expect($avatar->computedInitials())->toBe('?');
});

it('defaults alt to name', function () {
    $avatar = new Avatar(name: 'Jane Doe');

    expect($avatar->alt)->toBe('Jane Doe');
});

it('defaults alt to User avatar when no name', function () {
    $avatar = new Avatar();

    expect($avatar->alt)->toBe('User avatar');
});

it('uses explicit alt over name', function () {
    $avatar = new Avatar(name: 'Jane', alt: 'Custom alt');

    expect($avatar->alt)->toBe('Custom alt');
});

it('passes custom class to the wrapper', function () {
    $view = $this->blade('<x-hui::avatar name="Jane" class="h-10 w-10" />');

    $view->assertSee('h-10 w-10');
});
