<?php

it('renders a details element', function () {
    $view = $this->blade('
        <x-hui::disclosure>
            <x-hui::disclosure.head>Title</x-hui::disclosure.head>
            <x-hui::disclosure.content>Body</x-hui::disclosure.content>
        </x-hui::disclosure>
    ');

    $view->assertSee('<details', false);
    $view->assertSee('<summary', false);
    $view->assertSee('Title');
    $view->assertSee('Body');
});

it('renders open when opened prop is set', function () {
    $view = $this->blade('
        <x-hui::disclosure opened>
            <x-hui::disclosure.head>Title</x-hui::disclosure.head>
            <x-hui::disclosure.content>Content</x-hui::disclosure.content>
        </x-hui::disclosure>
    ');

    $view->assertSee('open', false);
    $view->assertSee('data-opened="true"', false);
});

it('renders disabled attribute', function () {
    $view = $this->blade('
        <x-hui::disclosure disabled>
            <x-hui::disclosure.head>Title</x-hui::disclosure.head>
            <x-hui::disclosure.content>Content</x-hui::disclosure.content>
        </x-hui::disclosure>
    ');

    $view->assertSee('data-disabled="true"', false);
});

it('renders container with max-count', function () {
    $view = $this->blade('
        <x-hui::disclosure.container :max-count="1">
            <x-hui::disclosure>
                <x-hui::disclosure.head>A</x-hui::disclosure.head>
                <x-hui::disclosure.content>A content</x-hui::disclosure.content>
            </x-hui::disclosure>
        </x-hui::disclosure.container>
    ');

    $view->assertSee('data-max-count="1"', false);
    $view->assertSee('data-hui-disclosure-container', false);
});

it('passes custom classes', function () {
    $view = $this->blade('
        <x-hui::disclosure class="my-class">
            <x-hui::disclosure.head class="head-class">Title</x-hui::disclosure.head>
            <x-hui::disclosure.content class="content-class">Body</x-hui::disclosure.content>
        </x-hui::disclosure>
    ');

    $view->assertSee('my-class');
    $view->assertSee('head-class');
    $view->assertSee('content-class');
});
