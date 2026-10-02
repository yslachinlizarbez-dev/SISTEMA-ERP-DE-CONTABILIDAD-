import React, { useState } from 'react';
import { ERPState, User } from '../types/erp';
import { DollarSign, Briefcase, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

interface AssetsExpensesViewProps {
  state: ERPState;
  currentUser: User;
  onRefresh: () => void;
}

export const AssetsExpensesView: React.FC<AssetsExpensesViewProps> = ({ state, currentUser, onRefresh }) => {
  const [tab, setTab] = useState<'expenses' | 'assets'>('expenses');
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState('Administrativo');
  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState(300);
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, provider: 'Varios', concept, amount: Number(amount), paymentMethod, user: currentUser.username })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al registrar gasto');
      setSuccess('¡Gasto registrado y asiento contable generado con éxito!');
      setShowModal(false);
      setConcept('');
      onRefresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDepreciate = async (assetId: string) => {
    try {
      const res = await fetch('/api/assets/depreciate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId, amount: 75, user: currentUser.username })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess('¡Depreciación registrada y asiento contable generado!');
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Gastos Operativos & Activos Fijos</h1>
          <p className="text-sm text-slate-400 mt-1">Control de gastos corporativos y depreciación de activos.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button onClick={() => setTab('expenses')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${tab === 'expenses' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Gastos</button>
            <button onClick={() => setTab('assets')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${tab === 'assets' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Activos Fijos</button>
          </div>
          {tab === 'expenses' && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-blue-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Gasto</span>
            </button>
          )}
        </div>
      </div>

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {tab === 'expenses' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Fecha</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Concepto</th>
                <th className="p-4">Forma de Pago</th>
                <th className="p-4">Monto</th>
                <th className="p-4">Usuario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {state.expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4">{new Date(exp.date).toLocaleString()}</td>
                  <td className="p-4 font-semibold text-blue-400">{exp.category}</td>
                  <td className="p-4 text-white">{exp.concept}</td>
                  <td className="p-4">{exp.paymentMethod}</td>
                  <td className="p-4 font-mono font-bold text-rose-400">S/ {exp.amount.toFixed(2)}</td>
                  <td className="p-4 text-slate-400">{exp.user}</td>
                </tr>
              ))}
              {state.expenses.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No hay gastos registrados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'assets' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Código</th>
                <th className="p-4">Nombre Activo</th>
                <th className="p-4">Valor Adquisición</th>
                <th className="p-4">Depreciación Acumulada</th>
                <th className="p-4">Valor en Libros</th>
                <th className="p-4">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {state.fixedAssets.map((ast) => (
                <tr key={ast.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-mono font-bold text-white">{ast.code}</td>
                  <td className="p-4 font-medium text-white">{ast.name}</td>
                  <td className="p-4 font-mono">S/ {ast.value.toFixed(2)}</td>
                  <td className="p-4 font-mono text-amber-400">S/ {ast.accumulatedDepreciation.toFixed(2)}</td>
                  <td className="p-4 font-mono font-bold text-emerald-400">S/ {ast.bookValue.toFixed(2)}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDepreciate(ast.id)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg font-semibold"
                    >
                      Registrar Depreciación S/ 75
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Registrar Gasto Operativo</h2>
            {error && <div className="mb-4 p-3 bg-red-500/10 text-red-400 text-xs rounded-xl">{error}</div>}
            <form onSubmit={handleCreateExpense} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 uppercase font-semibold mb-1">Categoría</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white">
                  <option value="Administrativo">Gastos Administrativos</option>
                  <option value="Ventas">Gastos de Ventas</option>
                  <option value="Servicios">Servicios Básicos</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 uppercase font-semibold mb-1">Concepto</label>
                <input type="text" required value={concept} onChange={(e) => setConcept(e.target.value)} placeholder="Ej. Pago de luz oficina" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 uppercase font-semibold mb-1">Monto (S/)</label>
                <input type="number" step="0.01" required value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 uppercase font-semibold mb-1">Forma de Pago</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white">
                  <option value="Efectivo">Efectivo (Disminuye Caja)</option>
                  <option value="Crédito">Crédito (Genera Cuenta por Pagar)</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-medium">Cancelar</button>
                <button type="submit" className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold">Guardar Gasto</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
