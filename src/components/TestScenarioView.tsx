import React, { useState } from 'react';
import { ERPState } from '../types/erp';
import { PlayCircle, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface TestScenarioViewProps {
  state: ERPState;
  onRefresh: () => void;
}

export const TestScenarioView: React.FC<TestScenarioViewProps> = ({ state, onRefresh }) => {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const runScenario = async () => {
    setRunning(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/test-scenario', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
      onRefresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Prueba Integral Obligatoria (9 Pasos)</h1>
        <p className="text-sm text-slate-400 mt-1">Ejecuta automáticamente el escenario de validación contable y financiera solicitado en la fase 51 del ERP.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Escenario de Prueba</h3>
            <p className="text-xs text-slate-400 mt-1">Compra al crédito, venta al contado, costo de venta, pago a proveedor, gasto, cobro de CxC, depreciación, depósito bancario y cierre.</p>
          </div>
          <button
            onClick={runScenario}
            disabled={running}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-600/20 transition disabled:opacity-50"
          >
            {running ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <PlayCircle className="w-5 h-5" />
            )}
            <span>Ejecutar Prueba Integral</span>
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>{result.message}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800 text-xs">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <p className="text-slate-400 uppercase font-semibold">Caja Final</p>
                <p className="text-lg font-bold text-white mt-1">S/ {result.summary.caja.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <p className="text-slate-400 uppercase font-semibold">Banco Final</p>
                <p className="text-lg font-bold text-white mt-1">S/ {result.summary.banco.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <p className="text-slate-400 uppercase font-semibold">Inventario Valorizado</p>
                <p className="text-lg font-bold text-white mt-1">S/ {result.summary.inventarioValorizado.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <p className="text-slate-400 uppercase font-semibold">Asientos Generados</p>
                <p className="text-lg font-bold text-emerald-400 mt-1">{result.summary.totalAsientos}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
