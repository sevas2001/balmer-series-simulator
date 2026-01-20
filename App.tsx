import React, { useState } from 'react';
import { SimulationState } from './types';
import { Controls } from './components/Controls';
import { SimulationCanvas } from './components/SimulationCanvas';
import { DataPanel } from './components/DataPanel';
import { Atom3D } from './components/Atom3D';
import { TransitionControls } from './components/TransitionControls';
import { Microscope } from 'lucide-react';
import { RYDBERG_THEORETICAL } from './constants';

const App: React.FC = () => {
  const [simulationState, setSimulationState] = useState<SimulationState>({
    distance: 41, // Default 41 cm
    lightPollution: 0, // Default 0% (Dark)
    showExperimental: false,
    rydbergConstant: RYDBERG_THEORETICAL,
    activeTransition: null,
  });

  const handleStateChange = (newState: Partial<SimulationState>) => {
    setSimulationState((prev) => ({ ...prev, ...newState }));
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col font-sans text-slate-200 selection:bg-indigo-500/30">
      {/* Header */}
      <header className="bg-[#151B2B] border-b border-slate-800 px-6 py-4 shadow-lg sticky top-0 z-10 backdrop-blur-sm bg-opacity-90">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-500/10 p-2.5 rounded-lg border border-indigo-500/20 ring-1 ring-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
              <Microscope className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100 leading-tight tracking-tight">Simulador de Espectroscopía</h1>
              <p className="text-xs text-indigo-400 font-medium tracking-wide uppercase mt-0.5">Experimento Serie de Balmer</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-md border border-slate-800">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="text-xs text-slate-400 font-mono">SISTEMA: ONLINE</span>
            </div>
            <span className="text-xs bg-indigo-950/50 text-indigo-300 px-3 py-1.5 rounded-md border border-indigo-500/20 font-semibold tracking-wider">
              FÍSICA EXPERIMENTAL III
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Controls & Data (4 cols) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          <Controls state={simulationState} onChange={handleStateChange} />
          <TransitionControls state={simulationState} onChange={handleStateChange} />
          <DataPanel state={simulationState} />
        </div>

        {/* Right Column: Visual Simulation (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">

          {/* Top: 3D Atom View */}
          <div className="h-[400px] w-full">
            <Atom3D state={simulationState} />
          </div>

          {/* Bottom: Spectrum View */}
          <div className="flex-1 min-h-[400px]">
            <div className="bg-[#151B2B] p-1 rounded-xl shadow-2xl border border-slate-800 h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

              <div className="p-4 mb-2 flex justify-between items-end border-b border-slate-800/50 pb-4">
                <div>
                  <h3 className="font-bold text-slate-200 tracking-tight flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    VISUALIZACIÓN DE DIFRACCIÓN
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-1">MODO: ESPECTRADA VS OBSERVADA</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold border border-slate-700 px-2 py-0.5 rounded">Rango Visible</p>
                </div>
              </div>
              <div className="flex-1 relative rounded-lg overflow-hidden border border-slate-800 bg-[#0B0F19] shadow-inner">
                <SimulationCanvas state={simulationState} />
              </div>

              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-6 text-xs text-slate-400 justify-center py-2 border-t border-slate-800/50 bg-[#151B2B]">
                <div className={`flex items-center gap-2 transition-opacity duration-300 ${simulationState.activeTransition && simulationState.activeTransition !== 3 ? 'opacity-30' : 'opacity-100'}`}>
                  <span className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
                  <span className="font-mono">H-α (n=3→2)</span>
                </div>
                <div className={`flex items-center gap-2 transition-opacity duration-300 ${simulationState.activeTransition && simulationState.activeTransition !== 4 ? 'opacity-30' : 'opacity-100'}`}>
                  <span className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)]"></span>
                  <span className="font-mono">H-β (n=4→2)</span>
                </div>
                <div className={`flex items-center gap-2 transition-opacity duration-300 ${simulationState.activeTransition && simulationState.activeTransition !== 5 ? 'opacity-30' : 'opacity-100'}`}>
                  <span className="w-2 h-2 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.5)]"></span>
                  <span className="font-mono">H-γ (n=5→2)</span>
                </div>
                <div className={`flex items-center gap-2 transition-opacity duration-300 ${simulationState.activeTransition && simulationState.activeTransition !== 6 ? 'opacity-30' : 'opacity-100'}`}>
                  <span className="w-2 h-2 bg-violet-600 rounded-full shadow-[0_0_8px_rgba(124,58,237,0.5)]"></span>
                  <span className="font-mono">H-δ (n=6→2)</span>
                </div>
                {simulationState.showExperimental && (
                  <div className="flex items-center gap-2 ml-2 border-l border-slate-700 pl-4 font-bold text-amber-500">
                    <span className="text-sm">▲</span> Experimental
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;