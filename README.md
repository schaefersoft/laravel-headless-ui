<div align="center">
    <a href="https://schaefersoft.ch">
        <picture>
            <source media="(prefers-color-scheme: light)" srcset="https://schaefersoft.ch/_static/logos/full_logo/dark/logo_full_dark.svg">
            <img alt="SchaeferSoft" src="https://schaefersoft.ch/_static/logos/full_logo/light/logo_full_light.svg" width="360">
        </picture>
    </a>
</div>

# Laravel HeadlessUI

[![Tests](https://github.com/schaefersoft/laravel-headless-ui/actions/workflows/tests.yml/badge.svg)](https://github.com/schaefersoft/laravel-headless-ui/actions)
[![Total downloads](https://img.shields.io/packagist/dt/schaefersoft/laravel-headless-ui)](https://packagist.org/packages/schaefersoft/laravel-headless-ui)
[![Latest Version on Packagist](https://img.shields.io/packagist/v/schaefersoft/laravel-headless-ui)](https://packagist.org/packages/schaefersoft/laravel-headless-ui)
[![License](https://img.shields.io/packagist/l/schaefersoft/laravel-headless-ui)](LICENSE)

A collection of completely unstyled, accessible Laravel Blade UI components. Built with performance, customization and
accessibility in mind. **No additional JavaScript dependencies required.**

## Requirements

- PHP 8.2+
- Laravel 10, 11, 12, or 13

## Installation

```bash
composer require schaefersoft/laravel-headless-ui
```

The package auto-discovers its service provider. No manual registration needed.

## Setup

Import the required CSS and JS assets in your application.

### CSS

```css
@import '../../vendor/schaefersoft/laravel-headless-ui/resources/css/hui.css';

/* If you are using TailwindCSS, append layer(base) */
@import '../../vendor/schaefersoft/laravel-headless-ui/resources/css/hui.css' layer(base);
```

### JS

**Option 1: Pre-built (recommended)**

No TypeScript tooling needed. Works out of the box with any bundler or `<script type="module">`.

```javascript
import '../../vendor/schaefersoft/laravel-headless-ui/dist/js/hui.js'
```

**Option 2: TypeScript source**

Import the TS source directly if your project already has a TypeScript build pipeline (e.g. Vite with
`laravel-vite-plugin`).

```javascript
import '../../vendor/schaefersoft/laravel-headless-ui/resources/js/hui.ts'
```

## Components

All components use the `x-hui::` Blade prefix and are completely unstyled. Style them with your own CSS or utility
classes.

| Component                              | Preview                                                                                                 |
|----------------------------------------|---------------------------------------------------------------------------------------------------------|
| [Avatar](./docs/avatar.md)             | <img src="./docs/assets/avatar/avatar_01.png" style="max-height: 180px; max-width: 400px;">             |
| [Dropdown](./docs/dropdown.md)         | <img src="./docs/assets/dropdown/dropdown_01.png" style="max-height: 180px; max-width: 400px;">         |
| [Dialog](./docs/dialog.md)             | <img src="./docs/assets/dialog/dialog_01.png" style="max-height: 180px; max-width: 400px;">             |
| [Disclosure](./docs/disclosure.md)     | <img src="./docs/assets/disclosure/disclosure_01.png" style="max-height: 180px; max-width: 400px;">     |
| [Flyout](./docs/flyout.md)             | <img src="./docs/assets/flyout/flyout_01.png" style="max-height: 180px; max-width: 400px;">             |
| [Range slider](./docs/range-slider.md) | <img src="./docs/assets/range-slider/range-slider_01.png" style="max-height: 180px; max-width: 400px;"> |
| [Tabs](./docs/tabs.md)                 | <img src="./docs/assets/tabs/tabs_01.png" style="max-height: 180px; max-width: 400px;">                 |
| [Toggle](./docs/toggle.md)             | <img src="./docs/assets/toggle/toggle_01.png" style="max-height: 180px; max-width: 400px;">             |
| [Tooltip](./docs/tooltip.md)           | <img src="./docs/assets/tooltip/tooltip_01.png" style="max-height: 180px; max-width: 400px;">           |
