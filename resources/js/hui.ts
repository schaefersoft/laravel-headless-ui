import './avatar/avatar'
import './range-slider/range-slider'

export function cn(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(' ');
}
