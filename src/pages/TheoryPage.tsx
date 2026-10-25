export function TheoryPage() {
  return (
    <div className="page theory">
      <section className="panel">
        <h2>Calculation Basis — TI SLUP263</h2>
        <p>v1 採用 First Harmonic Approximation (FHA)，限定於 Half-Bridge LLC 與 center-tapped/full-wave rectifier 的等效模型。</p>
        <div className="formula"><b>Equivalent load</b><code>Re = (8 n² / π²) · RL</code></div>
        <div className="formula"><b>Required DC gain</b><code>Mg = 2 n Vo / Vin</code></div>
        <div className="formula"><b>Normalized frequency</b><code>fn = fs / f0</code></div>
        <div className="formula"><b>Inductance ratio</b><code>Ln = Lm / Lr</code></div>
        <div className="formula"><b>Quality factor</b><code>Qe = √(Lr / Cr) / Re</code></div>
        <div className="formula"><b>Series resonance</b><code>f0 = 1 / (2π√(LrCr))</code></div>
        <div className="formula"><b>Tank back-calculation</b><code>Zr = Qe·Re; Lr = Zr/(2πf0); Cr = 1/(2πf0Zr); Lm = Ln·Lr</code></div>
        <p className="note">FHA 是初始設計模型；離共振點越遠時誤差可能增加。最終設計仍應以 switching simulation 與硬體量測驗證。</p>
      </section>
    </div>
  );
}
