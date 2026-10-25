import { describe, expect, it } from 'vitest';
import { equivalentLoad, gain, idealComponents, requiredGain } from './llc';
import type { DesignSpec } from '../types';

const spec: DesignSpec = { vinMin: 400, vinNom: 500, vinMax: 650, vo: 24, po: 1000, fr: 200000, n: 10 };

describe('SLUP263 FHA engine', () => {
  it('gain is unity at fn=1 for any Ln/Qe', () => {
    expect(gain(1, 5, 0.5)).toBeCloseTo(1, 10);
    expect(gain(1, 8, 0.3)).toBeCloseTo(1, 10);
  });
  it('computes requested half-bridge gains', () => {
    expect(requiredGain(400, spec)).toBeCloseTo(1.2, 8);
    expect(requiredGain(650, spec)).toBeCloseTo(0.738461538, 8);
  });
  it('computes positive equivalent load and tank values', () => {
    expect(equivalentLoad(spec)).toBeCloseTo(46.689, 2);
    const p = idealComponents(spec, { ln: 5, qe: 0.5 });
    expect(p.lr).toBeGreaterThan(0);
    expect(p.cr).toBeGreaterThan(0);
    expect(p.lm / p.lr).toBeCloseTo(5, 10);
  });
});
