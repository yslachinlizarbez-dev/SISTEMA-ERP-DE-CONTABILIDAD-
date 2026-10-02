import React, { useState } from 'react';
import { ERPState, User } from '../types/erp';
import { FileText, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';

interface CxCxPViewProps {
  state: ERPState;
  currentUser: User;
  onRefresh: () => void;
}

export const CxCxPView: React.FC<CxCxPViewProps> = ({ state, currentUser, onRefresh }) => {
  const [selectedAR, setSelectedAR] = useState<string | null>(null);
  const [selectedAP, setSelectedAP] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCollectAR = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/ar/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ arId: selectedAR, amount: Number(payAmount), user: currentUser.username })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cobrar');
      setSuccess('¡Cobro registrado con éxito y caja/contabilidad actualizada!');
      setSelectedAR(null);
      onRefresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handlePayAP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/ap/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apId: selectedAP, amount: Number(payAmount), user: currentUser.username })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al pagar');
      setSuccess('¡Pago a proveedor registrado con éxito!');
      setSelectedAP(null);
      onRefresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Cuentas por Cobrar & Cuentas por Pagar</h1>
        <p className="text-sm text-slate-400 mt-1">Gestión de créditos comerciales otorgados a clientes y deudas con proveedores.</p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-rose-400" />
            <span>Cuentas por Cobrar (Clientes)</span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Documento</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Fecha Emisión</th>
                <th className="p-4">Vencimiento</th>
                <th className="p-4">Importe Total</th>
                <th className="p-4">Cobrado</th>
                <th className="p-4">Saldo Pendiente</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {state.accountsReceivable.map((ar) => {
                const cust = state.customers.find(c => c.id === ar.customerId);
                return (
                  <tr key={ar.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-mono font-bold text-white">{ar.documentNumber}</td>
                    <td className="p-4 font-medium text-white">{cust ? cust.name : ar.customerId}</td>
                    <td className="p-4">{new Date(ar.date).toLocaleDateString()}</td>
                    <td className="p-4">{new Date(ar.dueDate).toLocaleDateString()}</td>
                    <td className="p-4 font-mono">S/ {ar.amount.toFixed(2)}</td>
                    <td className="p-4 font-mono text-emerald-400">S/ {ar.paidAmount.toFixed(2)}</td>
                    <td className="p-4 font-mono font-bold text-rose-400">S/ {ar.balance.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-lg font-semibold ${ar.status === 'Pagado' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {ar.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {ar.balance > 0 && (
                        <button
                          onClick={() => { setSelectedAR(ar.id); setPayAmount(ar.balance); }}
                          className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg font-semibold"
                        >
                          Cobrar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {state.accountsReceivable.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-6 text-center text-slate-500">No hay cuentas por cobrar registradas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-orange-400" />
            <span>Cuentas por Pagar (Proveedores)</span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Documento</th>
                <th className="p-4">Proveedor</th>
                <th className="p-4">Fecha Emisión</th>
                <th className="p-4">Vencimiento</th>
                <th className="p-4">Importe Total</th>
                <th className="p-4">Pagado</th>
                <th className="p-4">Saldo Deuda</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {state.accountsPayable.map((ap) => {
                const sup = state.suppliers.find(s => s.id === ap.supplierId);
                return (
                  <tr key={ap.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-mono font-bold text-white">{ap.documentNumber}</td>
                    <td className="p-4 font-medium text-white">{sup ? sup.name : ap.supplierId}</td>
                    <td className="p-4">{new Date(ap.date).toLocaleDateString()}</td>
                    <td className="p-4">{new Date(ap.dueDate).toLocaleDateString()}</td>
                    <td className="p-4 font-mono">S/ {ap.amount.toFixed(2)}</td>
                    <td className="p-4 font-mono text-emerald-400">S/ {ap.paidAmount.toFixed(2)}</td>
                    <td className="p-4 font-mono font-bold text-orange-400">S/ {ap.balance.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-lg font-semibold ${ap.status === 'Pagado' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {ap.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {ap.balance > 0 && (
                        <button
                          onClick={() => { setSelectedAP(ap.id); setPayAmount(ap.balance); }}
                          className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg font-semibold"
                        >
                          Pagar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {state.accountsPayable.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-6 text-center text-slate-500">No hay cuentas por pagar registradas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAR && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Registrar Cobro de Cliente</h2>
            {error && <div className="mb-4 p-3 bg-red-500/10 text-red-400 text-xs rounded-xl">{error}</div>}
            <form onSubmit={handleCollectAR} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 uppercase font-semibold mb-1">Monto a Cobrar (S/)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setSelectedAR(null)} className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-medium">Cancelar</button>
                <button type="submit" className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold">Confirmar Cobro</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedAP && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Registrar Pago a Proveedor</h2>
            {error && <div className="mb-4 p-3 bg-red-500/10 text-red-400 text-xs rounded-xl">{error}</div>}
            <form onSubmit={handlePayAP} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 uppercase font-semibold mb-1">Monto a Pagar (S/)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setSelectedAP(null)} className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-medium">Cancelar</button>
                <button type="submit" className="px-4 py-2.5 bg-purple-600 text-white rounded-xl font-semibold">Confirmar Pago</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
