<?php

namespace Schaefersoft\HeadlessUI\Tests;

use Orchestra\Testbench\TestCase as Orchestra;
use Schaefersoft\HeadlessUI\Providers\HeadlessUIProvider;

abstract class TestCase extends Orchestra
{
    protected function getPackageProviders($app): array
    {
        return [
            HeadlessUIProvider::class,
        ];
    }
}
