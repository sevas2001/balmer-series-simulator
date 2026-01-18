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
}

export interface ExperimentalData {
  id: string;
  wavelength: number; // in nanometers
}