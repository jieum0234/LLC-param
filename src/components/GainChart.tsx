import Plot from 'react-plotly.js';
import { gain, requiredGain } from '../engine/llc';
import type { DesignSpec, OperatingPoint } from '../types';

export function GainChart({ spec, ln, qe, points, title = 'FHA Gain Curve' }: {
  spec: DesignSpec;
  ln: number;
  qe: number;
  points: OperatingPoint[];
  title?: string;
}) {
  const x = Array.from({ length: 420 }, (_, i) => 0.2 + i * (2.3 / 419));
  const y = x.map((f) => gain(f, ln, qe));
  const reqs = [spec.vinMin, spec.vinNom, spec.vinMax].map((v) => requiredGain(v, spec));
  return (
    <Plot
      data={[
        { x, y, type: 'scatter', mode: 'lines', name: `Ln=${ln.toFixed(2)}, Qe=${qe.toFixed(2)}` },
        ...reqs.map((r, i) => ({ x: [0.2, 2.5], y: [r, r], type: 'scatter' as const, mode: 'lines' as const, name: ['Mg@Vin min', 'Mg@Vin nom', 'Mg@Vin max'][i], line: { dash: 'dot' as const } })),
        { x: points.filter(p => p.fn !== null).map(p => p.fn as number), y: points.filter(p => p.fn !== null).map(p => p.requiredGain), type: 'scatter', mode: 'markers+text', text: points.filter(p => p.fn !== null).map(p => p.label), textposition: 'top center', name: 'Operating points', marker: { size: 9 } },
      ]}
      layout={{
        title: { text: title },
        autosize: true,
        margin: { l: 60, r: 24, t: 55, b: 55 },
        xaxis: { title: { text: 'Normalized Frequency fn = fs / fr' }, range: [0.2, 2.5] },
        yaxis: { title: { text: 'Gain Mg' }, range: [0, Math.max(1.6, ...reqs) * 1.25] },
        legend: { orientation: 'h', y: -0.24 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
      }}
      config={{ responsive: true, displaylogo: false }}
      style={{ width: '100%', height: '470px' }}
    />
  );
}
