export function LLCSchematic() {
  return (
    <div className="schematic-card">
      <svg viewBox="0 0 980 220" role="img" aria-label="Half-bridge LLC schematic">
        <text x="20" y="35" className="label">Vin</text>
        <line x1="70" y1="25" x2="70" y2="195" className="wire" />
        <rect x="110" y="35" width="60" height="42" rx="6" className="device" />
        <text x="140" y="62" textAnchor="middle" className="label">Q1</text>
        <rect x="110" y="135" width="60" height="42" rx="6" className="device" />
        <text x="140" y="162" textAnchor="middle" className="label">Q2</text>
        <line x1="70" y1="45" x2="110" y2="45" className="wire" />
        <line x1="70" y1="165" x2="110" y2="165" className="wire" />
        <line x1="170" y1="56" x2="210" y2="106" className="wire" />
        <line x1="170" y1="156" x2="210" y2="106" className="wire" />
        <circle cx="210" cy="106" r="5" className="node" />
        <line x1="215" y1="106" x2="285" y2="106" className="wire" />
        <rect x="285" y="82" width="80" height="48" rx="8" className="passive" />
        <text x="325" y="111" textAnchor="middle" className="label">Cr</text>
        <line x1="365" y1="106" x2="410" y2="106" className="wire" />
        <rect x="410" y="82" width="80" height="48" rx="8" className="passive" />
        <text x="450" y="111" textAnchor="middle" className="label">Lr</text>
        <line x1="490" y1="106" x2="540" y2="106" className="wire" />
        <line x1="540" y1="106" x2="540" y2="180" className="wire" />
        <rect x="515" y="135" width="50" height="38" rx="7" className="passive" />
        <text x="540" y="160" textAnchor="middle" className="label">Lm</text>
        <rect x="600" y="60" width="110" height="95" rx="10" className="device" />
        <text x="655" y="96" textAnchor="middle" className="label">Transformer</text>
        <text x="655" y="122" textAnchor="middle" className="subLabel">n : 1 : 1</text>
        <line x1="540" y1="106" x2="600" y2="106" className="wire" />
        <line x1="710" y1="85" x2="760" y2="85" className="wire" />
        <line x1="710" y1="130" x2="760" y2="130" className="wire" />
        <text x="782" y="91" className="label">Rectifier</text>
        <line x1="840" y1="108" x2="900" y2="108" className="wire" />
        <rect x="900" y="72" width="55" height="72" rx="8" className="passive" />
        <text x="928" y="102" textAnchor="middle" className="label">Co</text>
        <text x="928" y="124" textAnchor="middle" className="subLabel">Load</text>
      </svg>
    </div>
  );
}
