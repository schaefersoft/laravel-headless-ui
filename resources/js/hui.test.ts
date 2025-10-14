import { describe, it, expect } from 'vitest';
import {cn} from "./hui";

describe('cn', () => {
    it('joins truthy class parts with spaces', () => {
        expect(cn('btn', false, 'btn-primary', undefined)).toBe('btn btn-primary');
    });
});