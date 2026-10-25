import { GainChart } from '../components/GainChart';
import { LLCSchematic } from '../components/LLCSchematic';
import { attainablePeak, equivalentLoad, idealComponents, loadResistance, operatingPoints, requiredGain } from '../engine/llc';
import type { DesignSpec, TankDesign } from '../types';

const fmt = (v: number, digits = 3) => Number.isFinite(v) ? v.toFixed(digits) : '—';

export function DesignPage({ spec, setSpec, tank, setTank }: {
  spec: DesignSpec;
  setSpec: (v: DesignSpec) => void;
  tank: TankDesign;
  setTank: (v: TankDesign) => void;
}) {
  const comp = idealComponents(spec, tank);
  const points = operatingPoints(spec, tank);
  const peak = attainablePeak(tank.ln, tank.qe);
  const mgMax = requiredGain(spec.vinMin, spec);
  const autoN = spec.vinNom / (2 * spec.vo);

  const field = (label: string, key: keyof DesignSpec, unit: string, step = 1) => (
    <label className="field"><span>{label}</span><div><input type="number" value={spec[key]} step={step} onChange={e => setSpec({ ...spec, [key]: Number(e.target.value) })} /><small>{unit}</small></div></label>
  );

  return (
    <div className="page">
      <LLCSchematic />
      <div className="two-col">
        <section className="panel">
          <h2>Design Specifications</h2>
          {field('Vin min', 'vinMin', 'V')}
          {field('Vin nominal', 'vinNom', 'V')}
          {field('Vin max', 'vinMax', 'V')}
          {field('Vout', 'vo', 'V')}
          {field('Pout', 'po', 'W')}
          {field('Resonant frequency', 'fr', 'Hz', 1000)}
          {field('Turns ratio n = Np/Ns', 'n', '', 0.1)}
          <button className="secondary" onClick={() => setSpec({ ...spec, n: Number(autoN.toFixed(4)) })}>Set n for Mg=1 at Vin nominal ({autoN.toFixed(3)})</button>
          <div className="summary-grid">
            <div><span>RL</span><strong>{fmt(loadResistance(spec))} Ω</strong></div>
            <div><span>Re</span><strong>{fmt(equivalentLoad(spec))} Ω</strong></div>
            <div><span>Mg max</span><strong>{fmt(requiredGain(spec.vinMin, spec))}</strong></div>
            <div><span>Mg min</span><strong>{fmt(requiredGain(spec.vinMax, spec))}</strong></div>
          </div>
          <h2>Tank Selection</h2>
          <label className="slider"><span>Ln = Lm/Lr <b>{tank.ln.toFixed(2)}</b></span><input type="range" min="1.5" max="12" step="0.05" value={tank.ln} onChange={e => setTank({ ...tank, ln: Number(e.target.value) })} /></label>
          <label className="slider"><span>Qe <b>{tank.qe.toFixed(2)}</b></span><input type="range" min="0.1" max="1.2" step="0.01" value={tank.qe} onChange={e => setTank({ ...tank, qe: Number(e.target.value) })} /></label>
          <div className={`status ${peak.gain > mgMax ? 'ok' : 'bad'}`}>
            Attainable FHA peak gain: {peak.gain.toFixed(3)} @ fn={peak.fn.toFixed(3)} — {peak.gain > mgMax ? 'above Mg max' : 'insufficient for Mg max'}
          </div>
          <div className="summary-grid">
            <div><span>Lr</span><strong>{(comp.lr * 1e6).toFixed(2)} µH</strong></div>
            <div><span>Cr</span><strong>{(comp.cr * 1e9).toFixed(2)} nF</strong></div>
            <div><span>Lm</span><strong>{(comp.lm * 1e6).toFixed(2)} µH</strong></div>
            <div><span>fr</span><strong>{(spec.fr / 1000).toFixed(1)} kHz</strong></div>
          </div>
        </section>
        <section className="panel chart-panel">
          <GainChart spec={spec} ln={tank.ln} qe={tank.qe} points={points} />
          <table><thead><tr><th>Case</th><th>Vin</th><th>Mg req.</th><th>fn</th><th>fs</th><th>Region</th></tr></thead><tbody>
            {points.map(p => <tr key={p.label}><td>{p.label}</td><td>{p.vin.toFixed(0)} V</td><td>{p.requiredGain.toFixed(3)}</td><td>{p.fn?.toFixed(3) ?? '—'}</td><td>{p.fs ? `${(p.fs/1000).toFixed(1)} kHz` : '—'}</td><td><span className={`pill ${p.region === 'Inductive' ? 'ok' : p.region === 'Capacitive' ? 'bad' : 'warn'}`}>{p.region}</span></td></tr>)}
          </tbody></table>
        </section>
      </div>
    </div>
  );
}
