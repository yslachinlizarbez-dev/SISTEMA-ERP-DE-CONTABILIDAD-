import React from 'react';
import { ERPState } from '../types/erp';
import { ShieldCheck, History } from 'lucide-react';

interface AuditViewProps {
  state: ERPState;
}

export const AuditView: React.FC<AuditViewProps> = ({ state }) => {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Auditoría & Trazabilidad Total</h1>
        <p className="text-sm text-slate-400 mt-1">Registro inmutable de todas las operaciones, cambios de precios, accesos y transacciones del ERP.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <History className="w-5 h-5 text-emerald-400" />
            <span>Registro de Auditoría del Sistema</span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Fecha y Hora</th>
                <th className="p-4">Usuario</th>
                <th className="p-4">Módulo</th>
                <th className="p-4">Acción</th>
                <th className="p-4">ID Registro</th>
                <th className="p-4">Detalles / Cambio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {state.auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-4 font-semibold text-white">{log.user}</td>
                  <td className="p-4"><span className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 font-semibold">{log.module}</span></td>
                  <td className="p-4 font-bold text-emerald-400">{log.action}</td>
                  <td className="p-4 font-mono text-slate-400">{log.recordId}</td>
                  <td className="p-4 font-mono text-[11px] text-slate-400 max-w-xs truncate">{log.newValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
