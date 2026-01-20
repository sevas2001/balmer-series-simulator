export interface SpectralLine {
  id: string;
  name: string;
  wavelength: number; // in nanometers
  color: string;
  baseOpacity: number;
}

export interface SimulationState {
  distance: number; // in cm
  lightPollution: number; // 0 to 100%
  showExperimental: boolean;
  rydbergConstant: number; // m^-1
  activeTransition: number | null; // n level (3, 4, 5, 6) or null for all
}

export interface ExperimentalData {
  id: string;
  wavelength: number; // in nanometers
}