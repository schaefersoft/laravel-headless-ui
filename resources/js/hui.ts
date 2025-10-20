import './avatar/avatar'
import './range-slider/range-slider'
import './tooltip/tooltip'

export function cn(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(' ');
}
