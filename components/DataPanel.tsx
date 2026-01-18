import React from 'react';
import { SimulationState } from '../types';
import { R_EXP_DARK, R_EXP_LIGHT, RYDBERG_THEORETICAL } from '../constants';
import { Calculator, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface DataPanelProps {
  state: SimulationState;
}

export const DataPanel: React.FC<DataPanelProps> = ({ state }) => {
  // Interpolate Rydberg constant based on light pollution
  const pollutionRatio = state.lightPollution / 100;
  const rExp = R_EXP_DARK + (R_EXP_LIGHT - R_EXP_DARK) * pollutionRatio;

  // Calculate relative error based on the theoretical value
  const error = Math.abs((rExp - RYDBERG_THEORETICAL) / RYDBERG_THEORETICAL) * 100;

  // 5% threshold for "Green/Red" status
  const isHighError = error > 5.5;

  return (
    <div className="bg-[#151B2B] p-6 rounded-xl shadow-lg border border-slate-800 space-y-6">
      <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
        <Calculator className="w-5 h-5 text-indigo-400" />
        Resultados en Tiempo Real
      </h2>

      <div className="bg-slate-900 p-4 rounded-lg border border-slate-700/50 shadow-inner">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
          Constante de Rydberg (R_exp)
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-mono font-bold text-indigo-100">
            {rExp.toExponential(4)}
          </span>
          <span className="text-sm text-slate-500">m⁻¹</span>
        </div>
        <p className="text-xs text-slate-600 mt-2 italic">
          * Dato interpolado según condiciones ambientales.
        </p>
      </div>

      <div className={`p-4 rounded-lg border flex items-start gap-3 transition-colors duration-300 ${isHighError ? 'bg-red-950/20 border-red-900/30' : 'bg-emerald-950/20 border-emerald-900/30'}`}>
        {isHighError ? (
          <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
        )}
        <div>
          <p className={`text-sm font-bold ${isHighError ? 'text-red-300' : 'text-emerald-300'}`}>
            Error Relativo: {error.toFixed(2)}%
          </p>
          <p className={`text-xs mt-1 ${isHighError ? 'text-red-400/80' : 'text-emerald-400/80'}`}>
            {isHighError
              ? "Alta contaminación lumínica reduce el contraste, dificultando la medición precisa de las líneas tenues."
              : "Condiciones óptimas. Error dentro del margen experimental aceptable."}
          </p>
        </div>
      </div>

      <div className="text-xs text-slate-500 border-t border-slate-800 pt-4">
        <p>Valor Teórico (Ref): <span className="font-mono text-slate-400">{RYDBERG_THEORETICAL.toExponential(4)} m⁻¹</span></p>
      </div>
    </div>
  );
};