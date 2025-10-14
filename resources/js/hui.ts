import './avatar/avatar'

export function cn(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(' ');
}
