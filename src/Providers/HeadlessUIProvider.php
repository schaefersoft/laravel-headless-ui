<?php

namespace Schaefersoft\HeadlessUI\Providers;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class HeadlessUIProvider extends ServiceProvider
{
    public function register(): void
    {

    }

    public function boot(): void
    {
        $this->loadViewsFrom(__DIR__ . '/../../resources/views', 'hui');

        Blade::componentNamespace('Schaefersoft\\HeadlessUI\\View\\Components', 'hui');
    }
}
