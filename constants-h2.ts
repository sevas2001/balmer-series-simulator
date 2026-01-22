import { SpectralLine } from './types';

// H2 Electronic Transitions (Visible - Continuous/Band-like appearance)
// Simulating the Fulcher-alpha bands and other visible systems
export const H2_ELECTRONIC_LINES: SpectralLine[] = [
    { id: 'h2-e1', name: 'H2 Elect. 1', wavelength: 601.8, color: '#FF3333', baseOpacity: 0.8 },
    { id: 'h2-e2', name: 'H2 Elect. 2', wavelength: 609.5, color: '#FF4433', baseOpacity: 0.7 },
    { id: 'h2-e3', name: 'H2 Elect. 3', wavelength: 615.2, color: '#FF5533', baseOpacity: 0.6 },
    { id: 'h2-e4', name: 'H2 Elect. 4', wavelength: 622.4, color: '#FF6633', baseOpacity: 0.5 },
    { id: 'h2-e5', name: 'H2 Elect. 5', wavelength: 580.0, color: '#FFCC00', baseOpacity: 0.4 },
    { id: 'h2-e6', name: 'H2 Elect. 6', wavelength: 585.5, color: '#FFDD00', baseOpacity: 0.45 },
    { id: 'h2-e7', name: 'H2 Elect. 7', wavelength: 490.0, color: '#00FFFF', baseOpacity: 0.3 },
    { id: 'h2-e8', name: 'H2 Elect. 8', wavelength: 495.5, color: '#00EEFF', baseOpacity: 0.35 },
    { id: 'h2-e9', name: 'H2 Elect. 9', wavelength: 460.0, color: '#0088FF', baseOpacity: 0.5 },
    { id: 'h2-e10', name: 'H2 Elect. 10', wavelength: 465.0, color: '#0077FF', baseOpacity: 0.55 },
    { id: 'h2-e11', name: 'H2 Elect. 11', wavelength: 420.0, color: '#8800FF', baseOpacity: 0.6 },
    { id: 'h2-e12', name: 'H2 Elect. 12', wavelength: 425.0, color: '#7700FF', baseOpacity: 0.65 },
    // Add some distinct "band heads"
    { id: 'h2-e13', name: 'H2 Band Head 1', wavelength: 650.0, color: '#FF0000', baseOpacity: 0.9 },
    { id: 'h2-e14', name: 'H2 Band Head 2', wavelength: 486.1, color: '#00FFFF', baseOpacity: 0.2 }, // Overlap check
];

// H2 Vibrational Transitions (Infrared - Near IR)
// Fundamental vibration is ~4161 cm^-1 -> ~2400 nm
// Overtones fall in visible/near-IR.
// We will simply visualize regular spacing characteristic of Harmonic Oscillator
// Pseudo-wavelengths scaled to be visible on our 300-800nm canvas for demonstration
// The label will show "Rel. Energy" or actual wavenumber if possible, but let's stick to nm for consistency
// and just define them in a way that looks like a vibrational progression.
// v=0->1, 0->2, 0->3... gets closer? 
// Anharmonic oscillator: energy levels getting closer -> lines getting closer (or further? Delta E decreases -> wavelength increases)
// Vibrational lines usually have delta E ~ constant - anharmonicity.
export const H2_VIBRATIONAL_LINES: SpectralLine[] = [
    // Visual representation of Equidistant-ish levels (Haromic) with slight Anharmonic (getting closer)
    { id: 'h2-v1', name: 'v(1-0)', wavelength: 750, color: '#CC0000', baseOpacity: 0.9 },
    { id: 'h2-v2', name: 'v(2-0)', wavelength: 680, color: '#DD2200', baseOpacity: 0.85 },
    { id: 'h2-v3', name: 'v(3-0)', wavelength: 620, color: '#EE4400', baseOpacity: 0.8 },
    { id: 'h2-v4', name: 'v(4-0)', wavelength: 570, color: '#FF6600', baseOpacity: 0.75 },
    { id: 'h2-v5', name: 'v(5-0)', wavelength: 530, color: '#FF8800', baseOpacity: 0.7 },
    { id: 'h2-v6', name: 'v(6-0)', wavelength: 500, color: '#FFAA00', baseOpacity: 0.65 },
    { id: 'h2-v7', name: 'v(7-0)', wavelength: 480, color: '#FFCC00', baseOpacity: 0.6 },
];

// H2 Rotational Transitions (Microwave/Far IR)
// Rigid Rotor: E = B*J*(J+1).  Delta E = 2B(J+1).
// Resulting spectrum lines are EQUIDISTANT in frequency (energy). 
// In wavelength: lambda ~ 1/E. So 1 / (space * n). 
// They will appear to spread out as wavelength increases (lower energy).
// We'll map them to the visual range 400-700 for "Visualization"
export const H2_ROTATIONAL_LINES: SpectralLine[] = [
    { id: 'h2-r0', name: 'J(0-1)', wavelength: 400, color: '#333333', baseOpacity: 0.5 }, // High Energy (Fake)
    { id: 'h2-r1', name: 'J(1-2)', wavelength: 420, color: '#444444', baseOpacity: 0.55 },
    { id: 'h2-r2', name: 'J(2-3)', wavelength: 445, color: '#555555', baseOpacity: 0.6 },
    { id: 'h2-r3', name: 'J(3-4)', wavelength: 475, color: '#666666', baseOpacity: 0.65 },
    { id: 'h2-r4', name: 'J(4-5)', wavelength: 510, color: '#777777', baseOpacity: 0.7 },
    { id: 'h2-r5', name: 'J(5-6)', wavelength: 550, color: '#888888', baseOpacity: 0.75 },
    { id: 'h2-r6', name: 'J(6-7)', wavelength: 600, color: '#999999', baseOpacity: 0.8 },
    { id: 'h2-r7', name: 'J(7-8)', wavelength: 660, color: '#AAAAAA', baseOpacity: 0.85 },
];
