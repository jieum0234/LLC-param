import { GainChart } from '../components/GainChart';
import { actualDerived, idealComponents, operatingPoints } from '../engine/llc';
import type { ActualComponents, DesignSpec, TankDesign } from '../types';

export function VerificationPage({ spec, tank, actual, setActual }: {
  spec: DesignSpec;
  tank: TankDesign;
  actual: ActualComponents;
  setActual: (v: ActualComponents) => void;
}) {
  const ideal = idealComponents(spec, tank);
  const d = actualDerived(spec, actual);
  const points = operatingPoints(spec, { ln: d.ln, qe: d.qe }, actual);
  const input = (label: string, key: keyof ActualComponents, scale: number, unit: string) => (
    <label className="field"><span>{label}</span><div><input type="number" step="0.1" value={(actual[key] * scale).toFixed(3)} onChange={e => setActual({ ...actual, [key]: Number(e.target.value) / scale })} /><small>{unit}</small></div></label>
  );
  const allInductive = points.every(p => p.region === 'Inductive');
  return (
    <div className="page two-col">
      <section className="panel">
        <h2>Actual Components</h2>
        <p className="muted">輸入實際可製作或購得的元件值，重新計算 fr、Ln、Qe。</p>
        {input('Lr', 'lr', 1e6, 'µH')}
        {input('Cr', 'cr', 1e9, 'nF')}
        {input('Lm', 'lm', 1e6, 'µH')}
        <button className="secondary" onClick={() => setActual(ideal)}>Reset to ideal values</button>
        <div className="compare">
          <h3>Ideal → Actual</h3>
          <div><span>Lr</span><b>{(ideal.lr*1e6).toFixed(2)} → {(actual.lr*1e6).toFixed(2)} µH</b></div>
          <div><span>Cr</span><b>{(ideal.cr*1e9).toFixed(2)} → {(actual.cr*1e9).toFixed(2)} nF</b></div>
          <div><span>Lm</span><b>{(ideal.lm*1e6).toFixed(2)} → {(actual.lm*1e6).toFixed(2)} µH</b></div>
          <div><span>fr</span><b>{(spec.fr/1000).toFixed(1)} → {(d.fr/1000).toFixed(1)} kHz</b></div>
          <div><span>Ln</span><b>{tank.ln.toFixed(3)} → {d.ln.toFixed(3)}</b></div>
          <div><span>Qe</span><b>{tank.qe.toFixed(3)} → {d.qe.toFixed(3)}</b></div>
        </div>
        <div className={`status ${allInductive ? 'ok' : 'warn'}`}>
          FHA ZVS feasibility: {allInductive ? 'all solved operating points are inductive' : 'one or more points are not inductive'}.
        </div>
        <p className="note">此判斷只代表輸入阻抗區域。完整 ZVS 還需檢查 MOSFET Coss/Ceq、commutation energy 與 dead time。</p>
      </section>
      <section className="panel chart-panel">
        <GainChart spec={spec} ln={d.ln} qe={d.qe} points={points} title="Actual Component Gain Curve" />
        <table><thead><tr><th>Case</th><th>fn</th><th>fs</th><th>Phase</th><th>Region</th></tr></thead><tbody>
          {points.map(p => <tr key={p.label}><td>{p.label}</td><td>{p.fn?.toFixed(3) ?? '—'}</td><td>{p.fs ? `${(p.fs/1000).toFixed(1)} kHz` : '—'}</td><td>{p.phaseDeg?.toFixed(2) ?? '—'}°</td><td>{p.region}</td></tr>)}
        </tbody></table>
      </section>
    </div>
  );
}
