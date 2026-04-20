<?php

use Illuminate\Support\Facades\Blade;

it('registers the view namespace', function () {
    $hints = view()->getFinder()->getHints();

    expect($hints)->toHaveKey('hui');
});

it('registers the blade component namespace', function () {
    $aliases = Blade::getClassComponentAliases();

    // Blade::componentNamespace registers under the prefix, not as aliases.
    // Verify by rendering a known component.
    $view = $this->blade('<x-hui::avatar name="Test" />');

    $view->assertSee('ui-avatar');
});
