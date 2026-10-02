import React, { useState } from 'react';
import { ERPState, User } from '../types/erp';
import { Wallet, Landmark, Plus, ArrowRightLeft, CheckCircle2, AlertCircle } from 'lucide-react';

interface CashBankViewProps {
  state: ERPState;
  currentUser: User;
  onRefresh: () => void;
}

export const CashBankView: React.FC<CashBankViewProps> = ({ state, currentUser, onRefresh }) => {
  const [showCashModal, setShowCashModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState(100);
  const [type, setType] = useState<'INGRESO' | 'EGRESO'>('INGRESO');
  const [bankId, setBankId] = useState(state.bankAccounts[0]?.id || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const activeCash = state.cashRegisters.find(c => c.status === 'Abierta');

  const handleCashMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/cash/movement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cashRegisterId: activeCash?.id,
          type,
          concept,
          amount: Number(amount),
          user: currentUser.username
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al registrar movimiento de caja');
      
      setSuccess('¡Movimiento de caja registrado y asiento contable generado con éxito!');
      setShowCashModal(false);
      setConcept('');
      setAmount(100);
      onRefresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleBankDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/banks/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankAccountId: bankId,
          amount: Number(amount),
          user: currentUser.username
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al realizar depósito bancario');
      
      setSuccess('¡Depósito bancario realizado con éxito! Caja y Banco actualizados contablemente.');
      setShowBankModal(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Tesorería: Caja & Bancos</h1>
        <p className="text-sm text-slate-400 mt-1">Control de apertura de caja, ingresos, egresos, cuentas bancarias y depósitos.</p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Caja Principal</h3>
                <p className="text-xs text-slate-400">Estado: <span className="text-emerald-400 font-semibold">{activeCash?.status}</span></p>
              </div>
            </div>
            <button
              onClick={() => setShowCashModal(true)}
              className="bg-amber-600 hover:bg-amber-500 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-lg shadow-amber-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Movimiento</span>
            </button>
          </div>

          <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Saldo Actual en Caja</p>
              <p className="text-2xl font-extrabold text-white mt-1">S/ {activeCash?.currentBalance.toFixed(2)}</p>
            </div>
            <div className="text-right text-xs text-slate-400">
              <p>Saldo Inicial: S/ {activeCash?.initialBalance.toFixed(2)}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Historial de Movimientos de Caja</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {state.cashMovements.map((mov) => (
                <div key={mov.id} className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs">
                  <div>
                    <p className="font-semibold text-white">{mov.concept}</p>
                    <p className="text-[10px] text-slate-400">{new Date(mov.date).toLocaleString()} | {mov.user}</p>
                  </div>
                  <span className={`font-mono font-bold ${mov.type === 'INGRESO' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {mov.type === 'INGRESO' ? '+' : '-'}S/ {mov.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Cuentas Bancarias</h3>
                <p className="text-xs text-slate-400">Gestión de depósitos y saldos</p>
              </div>
            </div>
            <button
              onClick={() => setShowBankModal(true)}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-lg shadow-cyan-600/20 transition"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Depositar</span>
            </button>
          </div>

          <div className="space-y-3">
            {state.bankAccounts.map((bank) => (
              <div key={bank.id} className="p-5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">{bank.bankName} - {bank.accountType}</p>
                  <p className="text-sm font-mono text-white mt-0.5">{bank.accountNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Saldo Contable</p>
                  <p className="text-xl font-extrabold text-white mt-0.5">S/ {bank.balance.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Movimientos Bancarios</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {state.bankMovements.map((bmov) => (
                <div key={bmov.id} className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs">
                  <div>
                    <p className="font-semibold text-white">{bmov.concept}</p>
                    <p className="text-[10px] text-slate-400">{new Date(bmov.date).toLocaleString()}</p>
                  </div>
                  <span className="font-mono font-bold text-emerald-400">+S/ {bmov.amount.toFixed(2)}</span>
                </div>
              ))}
              {state.bankMovements.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-4">No hay movimientos bancarios registrados.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showCashModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Movimiento de Caja</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <form onSubmit={handleCashMovement} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 uppercase font-semibold mb-1">Tipo de Movimiento</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="INGRESO">Ingreso a Caja</option>
                  <option value="EGRESO">Egreso de Caja</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-semibold mb-1">Concepto</label>
                <input
                  type="text"
                  required
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  placeholder="Ej. Ingreso por servicios diversos"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-semibold mb-1">Monto (S/)</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCashModal(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold shadow-lg shadow-amber-600/20"
                >
                  Registrar Movimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBankModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Depositar Caja a Banco</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <form onSubmit={handleBankDeposit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 uppercase font-semibold mb-1">Cuenta Bancaria Destino</label>
                <select
                  value={bankId}
                  onChange={(e) => setBankId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                >
                  {state.bankAccounts.map((b) => (
                    <option key={b.id} value={b.id}>{b.bankName} - {b.accountNumber}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-semibold mb-1">Monto a Depositar (S/)</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBankModal(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold shadow-lg shadow-cyan-600/20"
                >
                  Confirmar Depósito
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
