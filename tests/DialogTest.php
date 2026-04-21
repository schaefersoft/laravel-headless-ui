<?php

it('renders a dialog element', function () {
    $view = $this->blade('
        <x-hui::dialog id="test-dialog">
            <x-hui::dialog.panel>Content</x-hui::dialog.panel>
        </x-hui::dialog>
    ');

    $view->assertSee('<dialog', false);
    $view->assertSee('data-hui-dialog', false);
    $view->assertSee('id="test-dialog"', false);
    $view->assertSee('Content');
});

it('renders open by default', function () {
    $view = $this->blade('
        <x-hui::dialog id="test-dialog" open>
            <x-hui::dialog.panel>Content</x-hui::dialog.panel>
        </x-hui::dialog>
    ');

    $view->assertSee('data-hui-dialog-open', false);
});

it('renders overlay with aria-hidden', function () {
    $view = $this->blade('
        <x-hui::dialog id="test-dialog">
            <x-hui::dialog.overlay/>
            <x-hui::dialog.panel>Content</x-hui::dialog.panel>
        </x-hui::dialog>
    ');

    $view->assertSee('data-hui-dialog-overlay', false);
    $view->assertSee('aria-hidden="true"', false);
});

it('renders panel', function () {
    $view = $this->blade('
        <x-hui::dialog id="test-dialog">
            <x-hui::dialog.panel>Panel content</x-hui::dialog.panel>
        </x-hui::dialog>
    ');

    $view->assertSee('data-hui-dialog-panel', false);
    $view->assertSee('Panel content');
});

it('renders title', function () {
    $view = $this->blade('
        <x-hui::dialog id="test-dialog">
            <x-hui::dialog.panel>
                <x-hui::dialog.title>My Title</x-hui::dialog.title>
            </x-hui::dialog.panel>
        </x-hui::dialog>
    ');

    $view->assertSee('data-hui-dialog-title', false);
    $view->assertSee('<h2', false);
    $view->assertSee('My Title');
});

it('renders description', function () {
    $view = $this->blade('
        <x-hui::dialog id="test-dialog">
            <x-hui::dialog.panel>
                <x-hui::dialog.description>My description</x-hui::dialog.description>
            </x-hui::dialog.panel>
        </x-hui::dialog>
    ');

    $view->assertSee('data-hui-dialog-description', false);
    $view->assertSee('<p', false);
    $view->assertSee('My description');
});

it('renders close button attribute', function () {
    $view = $this->blade('
        <x-hui::dialog id="test-dialog">
            <x-hui::dialog.panel>
                <button data-hui-dialog-close>Close</button>
            </x-hui::dialog.panel>
        </x-hui::dialog>
    ');

    $view->assertSee('data-hui-dialog-close', false);
});

it('passes custom classes to all sub-components', function () {
    $view = $this->blade('
        <x-hui::dialog id="test-dialog" class="dialog-class">
            <x-hui::dialog.overlay class="overlay-class"/>
            <x-hui::dialog.panel class="panel-class">
                <x-hui::dialog.title class="title-class">Title</x-hui::dialog.title>
                <x-hui::dialog.description class="desc-class">Desc</x-hui::dialog.description>
            </x-hui::dialog.panel>
        </x-hui::dialog>
    ');

    $view->assertSee('dialog-class');
    $view->assertSee('overlay-class');
    $view->assertSee('panel-class');
    $view->assertSee('title-class');
    $view->assertSee('desc-class');
});

it('renders trigger attribute', function () {
    $view = $this->blade('
        <button data-hui-dialog-trigger="test-dialog">Open</button>
        <x-hui::dialog id="test-dialog">
            <x-hui::dialog.panel>Content</x-hui::dialog.panel>
        </x-hui::dialog>
    ');

    $view->assertSee('data-hui-dialog-trigger="test-dialog"', false);
});
