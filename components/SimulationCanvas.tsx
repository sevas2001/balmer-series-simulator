import React, { useRef, useEffect, useState } from 'react';
import { SimulationState } from '../types';
import { THEORETICAL_LINES, EXPERIMENTAL_LINES, GRATING_PERIOD } from '../constants';

interface SimulationCanvasProps {
  state: SimulationState;
}

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({ state }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle Resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Draw Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = dimensions.width;
    const height = dimensions.height;

    // High DPI scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // --- Physics Helpers ---
    // Scale: Max visible width covers about 45cm to each side
    const METERS_TO_PIXELS = (width / 2) / 0.45;

    const calculatePosition = (wavelengthNm: number, distanceCm: number) => {
      const lambda = wavelengthNm * 1e-9;
      const d = distanceCm / 100;
      // x = d * tan(asin(lambda / g))
      const theta = Math.asin(lambda / GRATING_PERIOD);
      const xMeters = d * Math.tan(theta);
      return xMeters * METERS_TO_PIXELS;
    };

    // --- 1. Dynamic Background & Layout ---
    // Interpolate background from Scientific Dark to Light Pollution
    // Dark: rgb(11, 15, 25) (Matches App Theme) -> Light: rgb(200, 203, 210)
    const p = state.lightPollution / 100;
    const r = Math.floor(11 + (189 * p));
    const g = Math.floor(15 + (188 * p));
    const b = Math.floor(25 + (185 * p));

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const midY = height / 2;

    // Grid / Ruler System
    ctx.strokeStyle = `rgba(100, 115, 140, ${0.15 + (0.1 * (1 - p))})`;
    ctx.lineWidth = 1;

    // Vertical Grid Lines (every ~50px or mapped to cm?)
    // Let's draw lines based on distance from center (screen geometry)
    for (let xOffset = 0; xOffset < width / 2; xOffset += 50) {
      // Right side
      ctx.beginPath(); ctx.moveTo(centerX + xOffset, 0); ctx.lineTo(centerX + xOffset, height); ctx.stroke();
      // Left side
      ctx.beginPath(); ctx.moveTo(centerX - xOffset, 0); ctx.lineTo(centerX - xOffset, height); ctx.stroke();
    }

    // Central Axis
    ctx.strokeStyle = `rgba(99, 102, 241, ${0.4 - p * 0.2})`; // Indigo axis
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Divider Line
    ctx.strokeStyle = `rgba(148, 163, 184, ${0.5 - p * 0.3})`;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(width, midY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Central Light Source (Zero Order) - Subtle Glow
    const centerGlow = ctx.createLinearGradient(centerX - 40, 0, centerX + 40, 0);
    centerGlow.addColorStop(0, `rgba(255, 255, 255, 0)`);
    centerGlow.addColorStop(0.5, `rgba(255, 255, 255, ${0.1 + (1 - p) * 0.1})`);
    centerGlow.addColorStop(1, `rgba(255, 255, 255, 0)`);

    ctx.fillStyle = centerGlow;
    ctx.fillRect(centerX - 40, 0, 80, height);

    // --- 2. TOP HALF: Theoretical Lines ---
    const glowIntensity = Math.max(0, 15 - (state.lightPollution * 0.2));

    // Sort lines by wavelength to handle spacing
    const sortedLines = [...THEORETICAL_LINES].sort((a, b) => b.wavelength - a.wavelength);

    // Simple staggered height logic
    // We will assign a "level" to each line: 0, 1, 2... based on proximity to neighbors
    const labelLevels: Record<string, number> = {};
    const drawnPositions: number[] = [];

    sortedLines.forEach(line => {
      const pos = calculatePosition(line.wavelength, state.distance);
      // Check distance to already processed lines
      let level = 0;
      // If generic check against all previous finds a collision (< 40px), bump level
      // Since we sort, we just check if we are close to ANY previous
      // A simple modulo approach works well for Balmer since they get closer in a sequence
      // H-alpha (656) -> Far
      // H-beta (486)
      // H-gamma (434)
      // H-delta (410)

      // H-gamma and H-delta are the collision risk usually.
      // Let's just hardcode staggering for the shorter wavelengths if they are close?
      // Actually, let's just cycle levels 0, 1, 2 for the series to be safe.
      if (line.id === 'h-delta') level = 2;
      else if (line.id === 'h-gamma') level = 1;
      else level = 0;

      labelLevels[line.wavelength] = level;
    });

    sortedLines.forEach((line) => {
      const offsetPx = calculatePosition(line.wavelength, state.distance);

      // Visibility Calculation
      let visibility = line.baseOpacity * (1 - p * 0.8);

      // Handle Active Transition Focus
      if (state.activeTransition) {
        const lineN = line.id === 'h-alpha' ? 3
          : line.id === 'h-beta' ? 4
            : line.id === 'h-gamma' ? 5
              : line.id === 'h-delta' ? 6 : 0;

        if (lineN !== state.activeTransition) {
          visibility *= 0.1; // Dim others significantly
        } else {
          visibility = 1.0; // Highlight target
        }
      }

      if (line.id === 'h-delta') {
        const violetFactor = Math.max(0, 1 - (state.lightPollution / 50));
        // If focusing on delta, ignore light pollution dimming a bit
        if (state.activeTransition !== 6) {
          visibility *= violetFactor;
        }
      }

      if (visibility <= 0.01) return;

      [-1, 1].forEach((direction) => {
        const x = centerX + (offsetPx * direction);
        const level = labelLevels[line.wavelength];
        const labelY = 30 + (level * 15); // Stagger text Y position

        ctx.save();

        // Neon Glow
        if (state.lightPollution < 60 || state.activeTransition) {
          ctx.shadowColor = line.color;
          ctx.shadowBlur = state.activeTransition ? 20 : glowIntensity;
        }

        // Beam
        const grad = ctx.createLinearGradient(x - 3, 0, x + 3, 0);
        grad.addColorStop(0, `rgba(0,0,0,0)`);
        grad.addColorStop(0.5, line.color);
        grad.addColorStop(1, `rgba(0,0,0,0)`);

        ctx.globalAlpha = visibility;
        ctx.fillStyle = grad;
        // Draw line with variable top start to avoid hitting text
        ctx.fillRect(x - 2, labelY + 10, 4, midY - (labelY + 10));

        // Core
        ctx.fillStyle = `rgba(255, 255, 255, 0.7)`;
        ctx.fillRect(x - 0.5, labelY + 10, 1, midY - (labelY + 10));

        // Label
        ctx.shadowBlur = 0;
        ctx.font = '500 10px "Inter", sans-serif'; // Use Inter
        ctx.textAlign = 'center';
        ctx.fillStyle = line.color;
        ctx.globalAlpha = Math.max(0.4, visibility);
        ctx.fillText(`${line.wavelength} nm`, x, labelY);

        // Connector from text to line
        ctx.strokeStyle = line.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = Math.max(0.2, visibility * 0.5);
        ctx.beginPath();
        ctx.moveTo(x, labelY + 2);
        ctx.lineTo(x, labelY + 8);
        ctx.stroke();

        ctx.restore();
      });
    });

    // --- 3. BOTTOM HALF: Experimental Data ---
    if (state.showExperimental) {
      EXPERIMENTAL_LINES.forEach((exp, idx) => {
        const offsetPx = calculatePosition(exp.wavelength, state.distance);
        // Stagger experimental too if needed, though usually just one set per student measurement
        // Use mod for simple stagger
        const level = idx % 2;
        const labelPad = 25 + (level * 15);

        [-1, 1].forEach((direction) => {
          const x = centerX + (offsetPx * direction);

          ctx.save();
          const markerColor = '#FBBF24'; // Amber-400

          ctx.strokeStyle = markerColor;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([2, 4]);

          // Stem
          ctx.beginPath();
          ctx.moveTo(x, height - labelPad);
          ctx.lineTo(x, midY + 10);
          ctx.stroke();

          ctx.setLineDash([]);

          // Arrow Head
          ctx.fillStyle = markerColor;
          ctx.beginPath();
          ctx.moveTo(x, midY + 4);
          ctx.lineTo(x - 3, midY + 10);
          ctx.lineTo(x + 3, midY + 10);
          ctx.closePath();
          ctx.fill();

          // Label
          ctx.font = 'bold 11px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillStyle = '#D97706'; // Amber-600
          ctx.fillText(`${exp.wavelength}`, x, height - labelPad + 10);

          ctx.restore();
        });
      });
    }

  }, [dimensions, state]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px] relative rounded-xl overflow-hidden shadow-inner border border-gray-300">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
        className="block"
      />

      {/* Dynamic Overlay Labels */}
      <div className={`absolute top-2 left-2 text-xs font-mono font-bold uppercase transition-colors duration-300 ${state.lightPollution > 50 ? 'text-gray-500' : 'text-gray-300'}`}>
        ▲ Teórico
      </div>
      {state.showExperimental && (
        <div className="absolute bottom-2 left-2 text-xs font-mono font-bold uppercase text-yellow-600">
          ▼ Experimental
        </div>
      )}
    </div>
  );
};