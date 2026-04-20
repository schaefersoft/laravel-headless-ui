<?php

it('renders tabs with tablist and panels', function () {
    $view = $this->blade('
        <x-hui::tabs>
            <x-hui::tabs.tablist>
                <x-hui::tabs.tab>Tab 1</x-hui::tabs.tab>
                <x-hui::tabs.tab>Tab 2</x-hui::tabs.tab>
            </x-hui::tabs.tablist>
            <x-hui::tabs.panel>Panel 1</x-hui::tabs.panel>
            <x-hui::tabs.panel>Panel 2</x-hui::tabs.panel>
        </x-hui::tabs>
    ');

    $view->assertSee('data-hui-tabs', false);
    $view->assertSee('role="tablist"', false);
    $view->assertSee('data-hui-tab', false);
    $view->assertSee('role="tabpanel"', false);
    $view->assertSee('Tab 1');
    $view->assertSee('Panel 1');
});

it('renders vertical orientation', function () {
    $view = $this->blade('
        <x-hui::tabs :vertical="true">
            <x-hui::tabs.tablist>
                <x-hui::tabs.tab>Tab</x-hui::tabs.tab>
            </x-hui::tabs.tablist>
            <x-hui::tabs.panel>Panel</x-hui::tabs.panel>
        </x-hui::tabs>
    ');

    $view->assertSee('data-hui-tabs-orientation="vertical"', false);
});

it('renders initial index', function () {
    $view = $this->blade('
        <x-hui::tabs :initial-index="2">
            <x-hui::tabs.tablist>
                <x-hui::tabs.tab>Tab</x-hui::tabs.tab>
            </x-hui::tabs.tablist>
            <x-hui::tabs.panel>Panel</x-hui::tabs.panel>
        </x-hui::tabs>
    ');

    $view->assertSee('data-hui-tabs-initial-index="2"', false);
});

it('renders active tab', function () {
    $view = $this->blade('
        <x-hui::tabs>
            <x-hui::tabs.tablist>
                <x-hui::tabs.tab active>Active Tab</x-hui::tabs.tab>
            </x-hui::tabs.tablist>
            <x-hui::tabs.panel>Panel</x-hui::tabs.panel>
        </x-hui::tabs>
    ');

    $view->assertSee('data-active', false);
});

it('renders disabled tab', function () {
    $view = $this->blade('
        <x-hui::tabs>
            <x-hui::tabs.tablist>
                <x-hui::tabs.tab disabled>Disabled</x-hui::tabs.tab>
            </x-hui::tabs.tablist>
            <x-hui::tabs.panel>Panel</x-hui::tabs.panel>
        </x-hui::tabs>
    ');

    $view->assertSee('data-disabled', false);
    $view->assertSee('aria-disabled="true"', false);
});

it('passes custom classes to all sub-components', function () {
    $view = $this->blade('
        <x-hui::tabs class="tabs-class">
            <x-hui::tabs.tablist class="list-class">
                <x-hui::tabs.tab class="tab-class">Tab</x-hui::tabs.tab>
            </x-hui::tabs.tablist>
            <x-hui::tabs.panel class="panel-class">Panel</x-hui::tabs.panel>
        </x-hui::tabs>
    ');

    $view->assertSee('tabs-class');
    $view->assertSee('list-class');
    $view->assertSee('tab-class');
    $view->assertSee('panel-class');
});
