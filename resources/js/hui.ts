import './avatar/avatar'
import './slider/slider'
import './range-slider/range-slider'
import './tooltip/tooltip'
import './tabs/tabs'

export function cn(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(' ');
}
