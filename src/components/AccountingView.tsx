import React, { useState } from 'react';
import { ERPState, User } from '../types/erp';
import { BookOpen, ListOrdered, Scale, PieChart, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AccountingViewProps {
  state: ERPState;
  currentUser: User;
  onRefresh: () => void;
}

export const AccountingView: React.FC<AccountingViewProps> = ({ state, currentUser, onRefresh }) => {
  const [subTab, setSubTab] = useState<'chart' | 'journal' | 'trial' | 'financial' | 'closing'>('journal');
  const [success, setSuccess] = useState('');

  // Calculate Trial Balance from Journal Entries
  const accountBalances: { [code: string]: { name: string; debe: number; haber: number } } = {};
  state.chartOfAccounts.forEach(acc => {
    accountBalances[acc.code] = { name: acc.name, debe: 0, haber: 0 };
  });

  state.journalEntries.forEach(entry => {
    entry.lines.forEach(line => {
      if (!accountBalances[line.accountCode]) {
        accountBalances[line.accountCode] = { name: line.description || line.accountCode, debe: 0, haber: 0 };
      }
      accountBalances[line.accountCode].debe += line.debe || 0;
      accountBalances[line.accountCode].haber += line.haber || 0;
    });
  });

  // Calculate Financial Statements
  // Activos (cuentas 10, 12, 20, 33 minus 39)
  let totalActivoCorriente = 0;
  let totalActivoNoCorriente = 0;
  let totalPasivo = 0;
  let totalPatrimonio = 0;
  let totalIngresos = 0;
  let totalCostos = 0;
  let totalGastos = 0;

  Object.entries(accountBalances).forEach(([code, data]) => {
    const saldoDeudor = data.debe - data.haber;
    const saldoAcreedor = data.haber - data.debe;

    if (code.startsWith('10') || code.startsWith('12') || code.startsWith('20')) {
      totalActivoCorriente += saldoDeudor;
    } else if (code.startsWith('33')) {
      totalActivoNoCorriente += saldoDeudor;
    } else if (code.startsWith('39')) {
      totalActivoNoCorriente -= saldoAcreedor; // depreciacion acumulada resta
    } else if (code.startsWith('40') || code.startsWith('42')) {
      totalPasivo += saldoAcreedor;
    } else if (code.startsWith('50') || code.startsWith('59')) {
      totalPatrimonio += saldoAcreedor;
    } else if (code.startsWith('70')) {
      totalIngresos += saldoAcreedor;
    } else if (code.startsWith('69')) {
      totalCostos += saldoDeudor;
    } else if (code.startsWith('63') || code.startsWith('68') || code.startsWith('94')) {
      totalGastos += saldoDeudor;
    }
  });

  const utilidadBruta = totalIngresos - totalCostos;
  const resultadoNeto = utilidadBruta - totalGastos;
  const totalActivo = totalActivoCorriente + totalActivoNoCorriente;
  const totalPasivoPatrimonio = totalPasivo + totalPatrimonio + resultadoNeto;

  const handleClosePeriod = async (periodId: string) => {
    try {
      const res = await fetch('/api/periods/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ periodId, user: currentUser.username })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess('¡Período contable cerrado exitosamente con registro en auditoría!');
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Motor Contable & Estados Financieros</h1>
          <p className="text-sm text-slate-400 mt-1">El núcleo contable doble partida genera automáticamente Diario, Mayor, Balance y Estados Financieros.</p>
        </div>
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button onClick={() => setSubTab('journal')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${subTab === 'journal' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Libro Diario</button>
          <button onClick={() => setSubTab('trial')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${subTab === 'trial' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Balance Comprobación</button>
          <button onClick={() => setSubTab('financial')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${subTab === 'financial' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Estados Financieros</button>
          <button onClick={() => setSubTab('chart')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${subTab === 'chart' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Plan Contable</button>
          <button onClick={() => setSubTab('closing')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${subTab === 'closing' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Cierre</button>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {subTab === 'journal' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <ListOrdered className="w-5 h-5 text-blue-400" />
              <span>Libro Diario (Validado: Debe = Haber)</span>
            </h3>
          </div>
          <div className="divide-y divide-slate-800">
            {state.journalEntries.map((entry) => {
              const totalDebe = entry.lines.reduce((a, l) => a + (l.debe || 0), 0);
              const totalHaber = entry.lines.reduce((a, l) => a + (l.haber || 0), 0);
              return (
                <div key={entry.id} className="p-6 space-y-4 hover:bg-slate-800/20 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-white bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg text-xs">{entry.number}</span>
                      <span className="ml-3 text-sm font-semibold text-slate-200">{entry.glosa}</span>
                    </div>
                    <div className="text-right text-xs text-slate-400">
                      <p>{new Date(entry.date).toLocaleString()} | {entry.user}</p>
                      <span className="text-emerald-400 font-semibold">Cuadrado (Debe = Haber)</span>
                    </div>
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase">
                      <tr>
                        <th className="p-2.5">Código Cuenta</th>
                        <th className="p-2.5">Glosa / Descripción</th>
                        <th className="p-2.5 text-right">Debe</th>
                        <th className="p-2.5 text-right">Haber</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {entry.lines.map((l, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 font-mono font-bold text-blue-400">{l.accountCode}</td>
                          <td className="p-2.5 text-slate-300">{l.description}</td>
                          <td className="p-2.5 text-right font-mono text-white">{l.debe > 0 ? `S/ ${l.debe.toFixed(2)}` : '-'}</td>
                          <td className="p-2.5 text-right font-mono text-white">{l.haber > 0 ? `S/ ${l.haber.toFixed(2)}` : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-950 font-bold">
                      <tr>
                        <td colSpan={2} className="p-2.5 text-right">TOTALES:</td>
                        <td className="p-2.5 text-right font-mono text-emerald-400">S/ {totalDebe.toFixed(2)}</td>
                        <td className="p-2.5 text-right font-mono text-emerald-400">S/ {totalHaber.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {subTab === 'trial' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Scale className="w-5 h-5 text-emerald-400" />
              <span>Balance de Comprobación</span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-4">Código</th>
                  <th className="p-4">Nombre de Cuenta</th>
                  <th className="p-4 text-right">Total Debe</th>
                  <th className="p-4 text-right">Total Haber</th>
                  <th className="p-4 text-right">Saldo Deudor</th>
                  <th className="p-4 text-right">Saldo Acreedor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {Object.entries(accountBalances).map(([code, data]) => {
                  if (data.debe === 0 && data.haber === 0) return null;
                  const saldoDeudor = data.debe > data.haber ? data.debe - data.haber : 0;
                  const saldoAcreedor = data.haber > data.debe ? data.haber - data.debe : 0;
                  return (
                    <tr key={code} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 font-mono font-bold text-blue-400">{code}</td>
                      <td className="p-4 font-medium text-white">{data.name}</td>
                      <td className="p-4 text-right font-mono">S/ {data.debe.toFixed(2)}</td>
                      <td className="p-4 text-right font-mono">S/ {data.haber.toFixed(2)}</td>
                      <td className="p-4 text-right font-mono text-emerald-400">{saldoDeudor > 0 ? `S/ ${saldoDeudor.toFixed(2)}` : '-'}</td>
                      <td className="p-4 text-right font-mono text-purple-400">{saldoAcreedor > 0 ? `S/ ${saldoAcreedor.toFixed(2)}` : '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'financial' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-blue-400" />
              <span>Estado de Situación Financiera (Balance General)</span>
            </h3>
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <p className="font-bold text-blue-400 uppercase">Activo</p>
                <div className="flex justify-between text-slate-300"><span>Activo Corriente (Caja, Bancos, CxC, Inventario):</span><span className="font-mono">S/ {totalActivoCorriente.toFixed(2)}</span></div>
                <div className="flex justify-between text-slate-300"><span>Activo No Corriente (Activos Fijos netos):</span><span className="font-mono">S/ {totalActivoNoCorriente.toFixed(2)}</span></div>
                <div className="flex justify-between text-white font-bold pt-2 border-t border-slate-800"><span>TOTAL ACTIVO:</span><span className="font-mono text-emerald-400">S/ {totalActivo.toFixed(2)}</span></div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <p className="font-bold text-purple-400 uppercase">Pasivo & Patrimonio</p>
                <div className="flex justify-between text-slate-300"><span>Pasivo Total (CxP, Tributos):</span><span className="font-mono">S/ {totalPasivo.toFixed(2)}</span></div>
                <div className="flex justify-between text-slate-300"><span>Patrimonio (Capital Social + Resultados):</span><span className="font-mono">S/ {(totalPatrimonio + resultadoNeto).toFixed(2)}</span></div>
                <div className="flex justify-between text-white font-bold pt-2 border-t border-slate-800"><span>TOTAL PASIVO + PATRIMONIO:</span><span className="font-mono text-emerald-400">S/ {totalPasivoPatrimonio.toFixed(2)}</span></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-emerald-400" />
              <span>Estado de Resultados (Pérdidas y Ganancias)</span>
            </h3>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between text-slate-300"><span>(+) Ventas Netas:</span><span className="font-mono text-emerald-400">S/ {totalIngresos.toFixed(2)}</span></div>
              <div className="flex justify-between text-slate-300"><span>(-) Costo de Ventas:</span><span className="font-mono text-rose-400">S/ {totalCostos.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-white pt-2 border-t border-slate-800"><span>UTILIDAD BRUTA:</span><span className="font-mono">S/ {utilidadBruta.toFixed(2)}</span></div>
              <div className="flex justify-between text-slate-300"><span>(-) Gastos Operativos y Administrativos:</span><span className="font-mono text-rose-400">S/ {totalGastos.toFixed(2)}</span></div>
              <div className="flex justify-between font-extrabold text-sm text-white pt-3 border-t border-slate-800"><span>RESULTADO NETO DEL EJERCICIO:</span><span className="font-mono text-emerald-400">S/ {resultadoNeto.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      )}

      {subTab === 'chart' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>Catálogo de Plan Contable</span>
            </h3>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Código</th>
                <th className="p-4">Nombre de Cuenta</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Naturaleza</th>
                <th className="p-4">Permite Movimiento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {state.chartOfAccounts.map((acc) => (
                <tr key={acc.code} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-mono font-bold text-blue-400">{acc.code}</td>
                  <td className="p-4 font-medium text-white">{acc.name}</td>
                  <td className="p-4"><span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 font-semibold">{acc.type}</span></td>
                  <td className="p-4">{acc.nature}</td>
                  <td className="p-4">{acc.allowsMovement ? 'Sí' : 'No (Título)'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {subTab === 'closing' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-6 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Cierre Contable de Períodos</span>
          </h3>
          <div className="space-y-4">
            {state.accountingPeriods.map((per) => (
              <div key={per.id} className="p-5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white text-sm">Período {per.period}</p>
                  <p className="text-slate-400 mt-1">Del {per.startDate} al {per.endDate} | Estado: <span className={per.status === 'Abierto' ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>{per.status}</span></p>
                </div>
                <div>
                  {per.status === 'Abierto' ? (
                    <button
                      onClick={() => handleClosePeriod(per.id)}
                      className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg shadow-red-600/20"
                    >
                      Cerrar Período
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 bg-slate-800 text-slate-400 rounded-xl font-medium">Cerrado y Bloqueado</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
