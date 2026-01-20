import React from 'react';
import { SimulationState } from '../types';
import { ArrowDown, RotateCcw } from 'lucide-react';

interface TransitionControlsProps {
    state: SimulationState;
    onChange: (newState: Partial<SimulationState>) => void;
}

export const TransitionControls: React.FC<TransitionControlsProps> = ({ state, onChange }) => {

    const handleTransition = (n: number) => {
        // If already active, maybe toggle off? Or just restart.
        // Let's set to null then quickly set to n to restart animation if needed
        // For now simple set.
        onChange({ activeTransition: n });
    };

    const clearTransition = () => {
        onChange({ activeTransition: null });
    };

    const transitions = [
        { n: 3, label: 'n=3 → n=2', color: 'bg-red-500', name: 'H-α' },
        { n: 4, label: 'n=4 → n=2', color: 'bg-cyan-400', name: 'H-β' },
        { n: 5, label: 'n=5 → n=2', color: 'bg-blue-600', name: 'H-γ' },
        { n: 6, label: 'n=6 → n=2', color: 'bg-violet-600', name: 'H-δ' },
    ];

    return (
        <div className="bg-[#151B2B] p-4 rounded-lg border border-slate-800 shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-slate-200 font-semibold text-sm flex items-center gap-2">
                    <ArrowDown className="w-4 h-4 text-indigo-400" />
                    Transiciones Electrónicas
                </h3>
                {state.activeTransition && (
                    <button
                        onClick={clearTransition}
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                        <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-2">
                {transitions.map((t) => {
                    const isActive = state.activeTransition === t.n;
                    return (
                        <button
                            key={t.n}
                            onClick={() => handleTransition(t.n)}
                            className={`
                    relative overflow-hidden p-2 rounded-md border text-left transition-all duration-200
                    ${isActive
                                    ? 'border-indigo-500 bg-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                                    : 'border-slate-700 hover:border-slate-600 bg-slate-800/50 hover:bg-slate-800'
                                }
                `}
                        >
                            <div className="flex justify-between items-center z-10 relative">
                                <span className={`text-xs font-mono font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                                    {t.label}
                                </span>
                                <span
                                    className={`w-2 h-2 rounded-full ${t.color} shadow-[0_0_5px_currentColor]`}
                                />
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5 font-medium">{t.name}</div>
                        </button>
                    );
                })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/50">
                <p className="text-[10px] text-slate-500 leading-relaxed italic">
                    Seleccione una transición para visualizar el salto cuántico y su línea espectral correspondiente.
                </p>
            </div>
        </div>
    );
};
