import { describe, it, expect } from 'vitest';
import {cn} from "./hui";

describe('cn', () => {
    it('joins truthy class parts with spaces', () => {
        expect(cn('btn', false, 'btn-primary', undefined)).toBe('btn btn-primary');
    });
});

describe('button behavior', () => {
    it('toggles aria-expanded', () => {
        document.body.innerHTML = `<button id="x" aria-expanded="false"></button>`;
        const btn = document.getElementById('x')!;
        btn.addEventListener('click', () => {
            btn.setAttribute('aria-expanded', String(btn.getAttribute('aria-expanded') !== 'true'));
        });
        btn.click();
        expect(btn.getAttribute('aria-expanded')).toBe('true');
    });
});
