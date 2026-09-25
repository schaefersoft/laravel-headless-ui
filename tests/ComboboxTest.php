<?php

use Schaefersoft\HeadlessUI\View\Components\Combobox\Combobox;
use Schaefersoft\HeadlessUI\View\Components\Combobox\Options;

it('renders a searchable single combobox by default', function () {
    $view = $this->blade('
        <x-hui::combobox>
            <x-hui::combobox.input placeholder="Search" />
            <x-hui::combobox.button>Toggle</x-hui::combobox.button>
            <x-hui::combobox.options>
                <x-hui::combobox.option value="1">Wade Cooper</x-hui::combobox.option>
            </x-hui::combobox.options>
        </x-hui::combobox>
    ');

    $view->assertSee('data-hui-combobox', false);
    $view->assertSee('data-hui-combobox-searchable', false);
    $view->assertSee('data-hui-combobox-filter', false);
    $view->assertDontSee('data-hui-combobox-multiple', false);
    $view->assertDontSee('data-hui-combobox-open', false);
    $view->assertSee('data-hui-combobox-input', false);
    $view->assertSee('placeholder="Search"', false);
    $view->assertSee('data-hui-combobox-button', false);
    $view->assertSee('role="listbox"', false);
    $view->assertSee('role="option"', false);
    $view->assertSee('data-value="1"', false);
    $view->assertSee('Wade Cooper');
});

it('renders flags as data attributes', function () {
    $view = $this->blade('
        <x-hui::combobox multiple disabled nullable immediate open :searchable="false" :filter="false">
            <x-hui::combobox.input />
            <x-hui::combobox.options />
        </x-hui::combobox>
    ');

    $view->assertSee('data-hui-combobox-multiple', false);
    $view->assertSee('data-hui-combobox-disabled', false);
    $view->assertSee('data-disabled', false);
    $view->assertSee('data-hui-combobox-nullable', false);
    $view->assertSee('data-hui-combobox-immediate', false);
    $view->assertSee('data-hui-combobox-open', false);
    $view->assertDontSee('data-hui-combobox-searchable', false);
    $view->assertDontSee('data-hui-combobox-filter', false);
});

it('renders a hidden input for single selection', function () {
    $view = $this->blade('
        <x-hui::combobox name="person" value="2">
            <x-hui::combobox.input />
            <x-hui::combobox.options />
        </x-hui::combobox>
    ');

    $view->assertSee('name="person"', false);
    $view->assertSee('value="2"', false);
    $view->assertSee('data-hui-combobox-value="[&quot;2&quot;]"', false);
});

it('renders an empty hidden input when nothing is selected', function () {
    $view = $this->blade('
        <x-hui::combobox name="person">
            <x-hui::combobox.input />
            <x-hui::combobox.options />
        </x-hui::combobox>
    ');

    $view->assertSee('<input type="hidden" data-hui-combobox-hidden-input name="person" value=""', false);
});

it('renders array hidden inputs for multiple selection', function () {
    $view = $this->blade('
        <x-hui::combobox name="tags" multiple :value="[\'a\', \'b\']">
            <x-hui::combobox.input />
            <x-hui::combobox.options />
        </x-hui::combobox>
    ');

    $view->assertSee('name="tags[]" value="a"', false);
    $view->assertSee('name="tags[]" value="b"', false);
});

it('does not render hidden inputs without a name', function () {
    $view = $this->blade('
        <x-hui::combobox value="a">
            <x-hui::combobox.input />
            <x-hui::combobox.options />
        </x-hui::combobox>
    ');

    $view->assertDontSee('data-hui-combobox-hidden-input', false);
});

it('normalizes values', function () {
    $combobox = new Combobox(value: [1, null, '', 'x'], multiple: true);
    expect($combobox->values)->toBe(['1', 'x']);

    $single = new Combobox(value: ['a', 'b']);
    expect($single->values)->toBe(['a']);

    $collection = new Combobox(value: collect([3, 4]), multiple: true);
    expect($collection->values)->toBe(['3', '4']);
});

it('does not double the array suffix', function () {
    $combobox = new Combobox(name: 'tags[]', multiple: true);
    expect($combobox->inputName)->toBe('tags[]');
});

it('renders anchor and gap', function () {
    $view = $this->blade('
        <x-hui::combobox>
            <x-hui::combobox.input />
            <x-hui::combobox.options anchor="top end" :gap="8" />
        </x-hui::combobox>
    ');

    $view->assertSee('data-hui-combobox-anchor="top end"', false);
    $view->assertSee('data-hui-combobox-gap="8"', false);
});

it('accepts all valid anchors', function (string $anchor) {
    expect((new Options(anchor: $anchor))->anchor)->toBe($anchor);
})->with(['top', 'bottom', 'top start', 'top end', 'bottom start', 'bottom end']);

it('throws on invalid anchor', function (string $anchor) {
    new Options(anchor: $anchor);
})->with(['left', 'bottom middle', 'top start end'])->throws(Exception::class);

it('renders disabled options and labels', function () {
    $view = $this->blade('
        <x-hui::combobox>
            <x-hui::combobox.input />
            <x-hui::combobox.options>
                <x-hui::combobox.option value="1" label="Wade" disabled>Wade Cooper</x-hui::combobox.option>
            </x-hui::combobox.options>
        </x-hui::combobox>
    ');

    $view->assertSee('data-label="Wade"', false);
    $view->assertSee('aria-disabled="true"', false);
});

it('renders no results and chips template', function () {
    $view = $this->blade('
        <x-hui::combobox multiple>
            <x-hui::combobox.chips class="chips">
                <span class="chip"><span data-hui-combobox-chip-label></span></span>
            </x-hui::combobox.chips>
            <x-hui::combobox.input />
            <x-hui::combobox.options>
                <x-hui::combobox.no-results>Nothing found</x-hui::combobox.no-results>
            </x-hui::combobox.options>
        </x-hui::combobox>
    ');

    $view->assertSee('data-hui-combobox-chips', false);
    $view->assertSee('data-hui-combobox-chip-template', false);
    $view->assertSee('data-hui-combobox-no-results', false);
    $view->assertSee('Nothing found');
});

it('passes custom classes', function () {
    $view = $this->blade('
        <x-hui::combobox class="root-class">
            <x-hui::combobox.input class="input-class" />
            <x-hui::combobox.options class="options-class">
                <x-hui::combobox.option value="a" class="option-class">A</x-hui::combobox.option>
            </x-hui::combobox.options>
        </x-hui::combobox>
    ');

    $view->assertSee('root-class');
    $view->assertSee('input-class');
    $view->assertSee('options-class');
    $view->assertSee('option-class');
});
