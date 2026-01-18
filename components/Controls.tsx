import React from 'react';
import { SimulationState } from '../types';
import { Ruler, Sun, Eye, FlaskConical } from 'lucide-react';

interface ControlsProps {
  state: SimulationState;
  onChange: (newState: Partial<SimulationState>) => void;
}

export const Controls: React.FC<ControlsProps> = ({ state, onChange }) => {
  return (
    <div className="bg-[#151B2B] p-6 rounded-xl shadow-lg border border-slate-800 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2 mb-1 tracking-tight">
          <FlaskConical className="w-6 h-6 text-indigo-400" />
          Configuración
        </h2>
        <p className="text-slate-400 text-sm">Ajusta los parámetros del experimento.</p>
      </div>

      {/* Distance Slider */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Ruler className="w-4 h-4 text-indigo-400" /> Distancia Pantalla (d)
          </label>
          <span className="text-sm font-mono bg-slate-900 border border-slate-700 px-3 py-1 rounded text-indigo-300 min-w-[3rem] text-center shadow-inner">
            {state.distance} <span className="text-slate-500 text-xs">cm</span>
          </span>
        </div>
        <div className="relative h-6 flex items-center">
          {/* Custom Range Track */}
          <input
            type="range"
            min="30"
            max="60"
            step="0.5"
            value={state.distance}
            onChange={(e) => onChange({ distance: parseFloat(e.target.value) })}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 font-mono">
          <span>30 cm</span>
          <span>60 cm</span>
        </div>
      </div>

      {/* Light Pollution Slider */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" /> Contaminación Lumínica
          </label>
          <span className="text-sm font-mono bg-slate-900 border border-slate-700 px-3 py-1 rounded text-amber-500 min-w-[3rem] text-center shadow-inner">
            {state.lightPollution}%
          </span>
        </div>
        <div className="relative h-6 flex items-center">
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={state.lightPollution}
            onChange={(e) => onChange({ lightPollution: parseFloat(e.target.value) })}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 font-mono">
          <span>Cueva (0%)</span>
          <span>Luz Solar (100%)</span>
        </div>
      </div>

      {/* Experimental Checkbox */}
      <div className="pt-6 border-t border-slate-700/50">
        <label className="flex items-center space-x-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={state.showExperimental}
              onChange={(e) => onChange({ showExperimental: e.target.checked })}
              className="sr-only"
            />
            <div
              className={`block w-10 h-6 rounded-full transition-colors border border-transparent ${state.showExperimental ? 'bg-indigo-600 border-indigo-500' : 'bg-slate-700 border-slate-600'
                }`}
            ></div>
            <div
              className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${state.showExperimental ? 'translate-x-4' : 'translate-x-0'
                }`}
            ></div>
          </div>
          <span className="text-sm font-medium text-slate-300 flex items-center gap-2 group-hover:text-indigo-400 transition-colors">
            <Eye className="w-4 h-4" /> Ver Datos Experimentales
          </span>
        </label>
        <p className="text-xs text-slate-500 mt-2 ml-1">
          Muestra los marcadores donde el alumno midió las líneas.
        </p>
      </div>
    </div>
  );
};