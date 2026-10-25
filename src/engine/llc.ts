import type { ActualComponents, DesignSpec, OperatingPoint, TankDesign } from '../types';

export const PI = Math.PI;

export function loadResistance(spec: DesignSpec): number {
  return (spec.vo * spec.vo) / spec.po;
}

// SLUP263 Eq. (9): Re = (8 n^2 / pi^2) * RL
export function equivalentLoad(spec: DesignSpec): number {
  return (8 * spec.n * spec.n / (PI * PI)) * loadResistance(spec);
}

// SLUP263 Eq. (15), (27), (28) for a half-bridge LLC.
export function requiredGain(vin: number, spec: DesignSpec): number {
  return (2 * spec.n * spec.vo) / vin;
}

// Magnitude of SLUP263 Eq. (23).
export function gain(fn: number, ln: number, qe: number): number {
  const fn2 = fn * fn;
  const re = (ln + 1) * fn2 - 1;
  const im = (fn2 - 1) * fn * qe * ln;
  const den = Math.hypot(re, im);
  if (den === 0) return Number.POSITIVE_INFINITY;
  return (ln * fn2) / den;
}

export function idealComponents(spec: DesignSpec, tank: TankDesign): ActualComponents {
  const re = equivalentLoad(spec);
  const zr = tank.qe * re;
  const w0 = 2 * PI * spec.fr;
  const lr = zr / w0;
  const cr = 1 / (w0 * zr);
  const lm = tank.ln * lr;
  return { lr, cr, lm };
}

export function actualDerived(spec: DesignSpec, actual: ActualComponents) {
  const re = equivalentLoad(spec);
  const fr = 1 / (2 * PI * Math.sqrt(actual.lr * actual.cr));
  const ln = actual.lm / actual.lr;
  const qe = Math.sqrt(actual.lr / actual.cr) / re;
  return { re, fr, ln, qe };
}

type Complex = { re: number; im: number };
function parallel(a: Complex, b: Complex): Complex {
  const den = (a.re + b.re) ** 2 + (a.im + b.im) ** 2;
  const nr = a.re * b.re - a.im * b.im;
  const ni = a.re * b.im + a.im * b.re;
  return {
    re: (nr * (a.re + b.re) + ni * (a.im + b.im)) / den,
    im: (ni * (a.re + b.re) - nr * (a.im + b.im)) / den,
  };
}

export function inputImpedancePhaseDeg(
  fn: number,
  spec: DesignSpec,
  components: ActualComponents,
): number {
  const reLoad = equivalentLoad(spec);
  const fr = 1 / (2 * PI * Math.sqrt(components.lr * components.cr));
  const w = 2 * PI * fn * fr;
  const zLm: Complex = { re: 0, im: w * components.lm };
  const zRe: Complex = { re: reLoad, im: 0 };
  const zPar = parallel(zLm, zRe);
  const zin: Complex = {
    re: zPar.re,
    im: zPar.im + w * components.lr - 1 / (w * components.cr),
  };
  return (Math.atan2(zin.im, zin.re) * 180) / PI;
}

export function regionFromPhase(phaseDeg: number): OperatingPoint['region'] {
  if (phaseDeg > 0.05) return 'Inductive';
  if (phaseDeg < -0.05) return 'Capacitive';
  return 'Resistive';
}

function bisectRoot(target: number, ln: number, qe: number, a: number, b: number): number {
  let fa = gain(a, ln, qe) - target;
  for (let i = 0; i < 60; i += 1) {
    const m = (a + b) / 2;
    const fm = gain(m, ln, qe) - target;
    if (Math.abs(fm) < 1e-8) return m;
    if (Math.sign(fa) === Math.sign(fm)) {
      a = m;
      fa = fm;
    } else {
      b = m;
    }
  }
  return (a + b) / 2;
}

export function solveOperatingFn(
  target: number,
  ln: number,
  qe: number,
  spec: DesignSpec,
  components: ActualComponents,
): number | null {
  const roots: number[] = [];
  const min = 0.2;
  const max = 3.0;
  const steps = 1800;
  let x0 = min;
  let y0 = gain(x0, ln, qe) - target;
  for (let i = 1; i <= steps; i += 1) {
    const x1 = min + ((max - min) * i) / steps;
    const y1 = gain(x1, ln, qe) - target;
    if (Number.isFinite(y0) && Number.isFinite(y1) && y0 * y1 < 0) {
      roots.push(bisectRoot(target, ln, qe, x0, x1));
    }
    if (Math.abs(y1) < 1e-5) roots.push(x1);
    x0 = x1;
    y0 = y1;
  }
  const unique = roots.filter((v, i, arr) => i === 0 || Math.abs(v - arr[i - 1]) > 1e-3);
  if (!unique.length) return null;
  const inductive = unique.filter((fn) => inputImpedancePhaseDeg(fn, spec, components) >= 0);
  const candidates = inductive.length ? inductive : unique;
  return candidates.sort((a, b) => Math.abs(a - 1) - Math.abs(b - 1))[0];
}

export function operatingPoints(spec: DesignSpec, tank: TankDesign, actual?: ActualComponents): OperatingPoint[] {
  const components = actual ?? idealComponents(spec, tank);
  const derived = actual ? actualDerived(spec, actual) : { ln: tank.ln, qe: tank.qe, fr: spec.fr };
  const cases = [
    { label: 'Vin min', vin: spec.vinMin },
    { label: 'Vin nom', vin: spec.vinNom },
    { label: 'Vin max', vin: spec.vinMax },
  ];
  return cases.map(({ label, vin }) => {
    const req = requiredGain(vin, spec);
    const fn = solveOperatingFn(req, derived.ln, derived.qe, spec, components);
    if (fn === null) {
      return { label, vin, requiredGain: req, fn: null, fs: null, phaseDeg: null, region: 'No solution' };
    }
    const phaseDeg = inputImpedancePhaseDeg(fn, spec, components);
    return {
      label,
      vin,
      requiredGain: req,
      fn,
      fs: fn * derived.fr,
      phaseDeg,
      region: regionFromPhase(phaseDeg),
    };
  });
}

export function attainablePeak(ln: number, qe: number) {
  let bestFn = 0.2;
  let bestGain = gain(bestFn, ln, qe);
  for (let i = 1; i <= 5000; i += 1) {
    const fn = 0.2 + (1.2 * i) / 5000;
    const g = gain(fn, ln, qe);
    if (g > bestGain) {
      bestGain = g;
      bestFn = fn;
    }
  }
  return { fn: bestFn, gain: bestGain };
}
