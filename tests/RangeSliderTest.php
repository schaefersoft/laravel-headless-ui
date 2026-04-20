<?php

use Schaefersoft\HeadlessUI\Enums\RangeSlider\ThumbRole;
use Schaefersoft\HeadlessUI\View\Components\RangeSlider\Input\Input;
use Schaefersoft\HeadlessUI\View\Components\RangeSlider\Thumb\Thumb;

it('renders a range slider wrapper', function () {
    $view = $this->blade('
        <x-hui::range-slider>
            <x-hui::range-slider.track>
                <x-hui::range-slider.track.value/>
                <x-hui::range-slider.thumb role="min" min="0" max="100" value="20"/>
            </x-hui::range-slider.track>
        </x-hui::range-slider>
    ');

    $view->assertSee('data-hui-range-slider', false);
    $view->assertSee('data-hui-range-slider-track', false);
    $view->assertSee('data-hui-range-slider-track-value', false);
    $view->assertSee('type="range"', false);
});

it('renders dual thumbs', function () {
    $view = $this->blade('
        <x-hui::range-slider>
            <x-hui::range-slider.track>
                <x-hui::range-slider.track.value/>
                <x-hui::range-slider.thumb role="min" min="0" max="100" value="20"/>
                <x-hui::range-slider.thumb role="max" min="0" max="100" value="80"/>
            </x-hui::range-slider.track>
        </x-hui::range-slider>
    ');

    $view->assertSee('data-hui-range-slider-thumb="min"', false);
    $view->assertSee('data-hui-range-slider-thumb="max"', false);
});

it('renders synced input', function () {
    $view = $this->blade('
        <x-hui::range-slider>
            <x-hui::range-slider.track>
                <x-hui::range-slider.thumb role="min" min="0" max="100" value="20"/>
            </x-hui::range-slider.track>
            <x-hui::range-slider.input role="min" class="w-20"/>
        </x-hui::range-slider>
    ');

    $view->assertSee('type="number"', false);
    $view->assertSee('data-hui-range-slider-value="min"', false);
});

it('accepts ThumbRole enum for thumb', function () {
    $thumb = new Thumb(role: ThumbRole::Min);

    expect($thumb->role)->toBe('min');
});

it('accepts ThumbRole enum for input', function () {
    $input = new Input(class: '', role: ThumbRole::Max);

    expect($input->role)->toBe('max');
});

it('throws on invalid thumb role', function () {
    new Thumb(role: 'invalid');
})->throws(InvalidArgumentException::class);

it('throws on invalid input role', function () {
    new Input(class: '', role: 'invalid');
})->throws(InvalidArgumentException::class);

it('passes custom classes to track components', function () {
    $view = $this->blade('
        <x-hui::range-slider>
            <x-hui::range-slider.track class="track-class">
                <x-hui::range-slider.track.value class="value-class"/>
                <x-hui::range-slider.thumb role="min" min="0" max="100" value="50"/>
            </x-hui::range-slider.track>
        </x-hui::range-slider>
    ');

    $view->assertSee('track-class');
    $view->assertSee('value-class');
});
