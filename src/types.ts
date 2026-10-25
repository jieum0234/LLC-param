export type DesignSpec = {
  vinMin: number;
  vinNom: number;
  vinMax: number;
  vo: number;
  po: number;
  fr: number;
  n: number;
};

export type TankDesign = {
  ln: number;
  qe: number;
};

export type ActualComponents = {
  lr: number;
  cr: number;
  lm: number;
};

export type OperatingPoint = {
  label: string;
  vin: number;
  requiredGain: number;
  fn: number | null;
  fs: number | null;
  phaseDeg: number | null;
  region: 'Inductive' | 'Capacitive' | 'Resistive' | 'No solution';
};
