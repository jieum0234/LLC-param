# LLC Design Tool

Static browser-based design aid for a half-bridge LLC resonant converter using the First Harmonic Approximation (FHA) equations in TI SLUP263.

## v1 scope

- Input: Vin min/nom/max, Vout, Pout, resonant frequency, transformer ratio.
- Interactive Ln and Qe sliders.
- FHA gain curve and required-gain lines.
- Numerical operating-point search for fn and fs.
- Input-impedance phase classification: inductive / capacitive / resistive.
- Back-calculation of Lr, Cr, Lm.
- Actual-component verification: recalculate fr, Ln, Qe and operating points.
- Theory page documenting the equations used.

## Important limitation

"Inductive" is only a necessary ZVS feasibility condition. Full ZVS verification also requires commutation energy, MOSFET Coss/Ceq and dead-time checks. FHA accuracy also degrades away from series resonance.

## Local development

```bash
npm install
npm run dev
```

## Tests and build

```bash
npm test
npm run build
```

## GitHub Pages

1. Push this repository to GitHub using `main` as the default branch.
2. Open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push a commit; `.github/workflows/deploy.yml` builds and deploys the site.

Vite uses a relative base path (`./`), so the site works under a normal GitHub Pages repository subpath.
