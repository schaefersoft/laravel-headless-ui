# Avatar

The Avatar component renders a user image with a fallback to initials.

![Avatar example](./assets/avatar/avatar_01.png)

## Usage

Blade component: `x-hui::avatar`

Image with name (renders `<img>` and uses name as default alt):

```bladehtml
<x-hui::avatar src="https://example.com/u/42.png" name="Jane Doe" />
```

No image source (shows computed initials from name):

```bladehtml
<x-hui::avatar name="Jane Doe" />
```

Explicit initials (overrides computed initials):

```bladehtml
<x-hui::avatar initials="JD" />
```

Custom alt text (overrides default alt from name):

```bladehtml
<x-hui::avatar src="/img/jane.png" alt="Profile picture of Jane" />
```

## Styling

The component has minimal defaults (flexbox, aspect ratio, border-radius). Override size, shape, and colors with your own classes.

```bladehtml
<x-hui::avatar name="Jane Doe" class="h-10 w-10 rounded-md ring-2 ring-indigo-500" />
```

## Props

| Prop       | Type     | Default                    | Description                                                                                                         |
|------------|----------|----------------------------|---------------------------------------------------------------------------------------------------------------------|
| `src`      | `string` | `null`                     | Image URL. When present, renders an `<img>`. If it fails to load, the component's JS reveals the initials fallback. |
| `name`     | `string` | `null`                     | Used to compute initials when `initials` is not provided. Also used as default `alt` text when `alt` is not set.    |
| `initials` | `string` | `null`                     | Explicit initials to display. Overrides initials computed from `name`. Trimmed and uppercased.                      |
| `alt`      | `string` | `name` or `"User avatar"`  | Alt text for the image. Defaults to `name` if present; otherwise falls back to `"User avatar"`.                     |
| `class`    | `string` | `""`                       | Additional classes for the wrapper.                                                                                 |

## Accessibility

- The fallback initials element uses `aria-hidden` to toggle visibility based on whether the image loaded successfully.
- The `<img>` element always has an `alt` attribute (from `alt`, `name`, or `"User avatar"`).
