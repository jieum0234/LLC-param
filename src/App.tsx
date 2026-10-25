import { useMemo, useState } from 'react';
import { DesignPage } from './pages/DesignPage';
import { TheoryPage } from './pages/TheoryPage';
import { VerificationPage } from './pages/VerificationPage';
import { idealComponents } from './engine/llc';
import type { ActualComponents, DesignSpec, TankDesign } from './types';

export default function App() {
  const [tab, setTab] = useState<'design' | 'verify' | 'theory'>('design');
  const [spec, setSpec] = useState<DesignSpec>({ vinMin: 400, vinNom: 500, vinMax: 650, vo: 24, po: 1000, fr: 200000, n: 10 });
  const [tank, setTank] = useState<TankDesign>({ ln: 5, qe: 0.5 });
  const ideal = useMemo(() => idealComponents(spec, tank), [spec, tank]);
  const [actual, setActual] = useState<ActualComponents>(ideal);

  return (
    <>
      <header>
        <div><h1>LLC Design Tool</h1><p>Half-Bridge LLC · FHA · SLUP263</p></div>
        <nav>
          <button className={tab === 'design' ? 'active' : ''} onClick={() => setTab('design')}>Design</button>
          <button className={tab === 'verify' ? 'active' : ''} onClick={() => setTab('verify')}>Verification</button>
          <button className={tab === 'theory' ? 'active' : ''} onClick={() => setTab('theory')}>Theory</button>
        </nav>
      </header>
      <main>
        {tab === 'design' && <DesignPage spec={spec} setSpec={setSpec} tank={tank} setTank={setTank} />}
        {tab === 'verify' && <VerificationPage spec={spec} tank={tank} actual={actual} setActual={setActual} />}
        {tab === 'theory' && <TheoryPage />}
      </main>
      <footer>FHA design aid only — verify final hardware with switching simulation and measurement.</footer>
    </>
  );
}
