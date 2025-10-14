<div data-ui-avatar @class(["ui-avatar", $class])>
    @if($src)
        <img src="{{ $src }}" alt="{{ $alt ?? ($name ?? 'User avatar') }}" />
    @endif
    <span data-ui-avatar-fallback @if($src) style="display:none" @endif aria-hidden="{{ $src ? 'true' : 'false' }}">
        {{ $computedInitials }}
    </span>
</div>
