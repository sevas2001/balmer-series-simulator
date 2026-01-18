import { SpectralLine, ExperimentalData } from './types';

// Physical constants
export const GRATING_PERIOD = 1.731e-6; // meters (g)
export const RYDBERG_THEORETICAL = 1.097373e7; // m^-1

// R_exp values for interpolation (Specific values from prompt)
export const R_EXP_DARK = 1.0431e7; // m^-1 (Optimal condition, ~4.94% error)
export const R_EXP_LIGHT = 1.0253e7; // m^-1 (High pollution, ~6.56% error)

export const THEORETICAL_LINES: SpectralLine[] = [
  { id: 'h-alpha', name: 'H-α', wavelength: 656.28, color: '#FF2200', baseOpacity: 1.0 }, // Red
  { id: 'h-beta', name: 'H-β', wavelength: 486.13, color: '#00FFFF', baseOpacity: 0.9 }, // Cyan
  { id: 'h-gamma', name: 'H-γ', wavelength: 434.05, color: '#4444FF', baseOpacity: 0.85 }, // Blue
  { id: 'h-delta', name: 'H-δ', wavelength: 410.17, color: '#7A00FF', baseOpacity: 0.7 }, // Violet
];

// Exact experimental values from student data
export const EXPERIMENTAL_LINES: ExperimentalData[] = [
  { id: 'exp-alpha', wavelength: 677.9 }, // Slight shift
  { id: 'exp-beta', wavelength: 495.6 },  // Slight shift
  { id: 'exp-gamma', wavelength: 482.6 }, // HUGE shift (~10% error)
  { id: 'exp-delta', wavelength: 429.5 }, // Shift
];