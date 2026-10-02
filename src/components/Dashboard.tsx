import React from 'react';
import { ERPState } from '../types/erp';
import {
  TrendingUp,
  ShoppingBag,
  ShoppingCart,
  Wallet,
  Landmark,
  FileText,
  Boxes,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  Activity
} from 'lucide-react';

interface DashboardProps {
  state: ERPState;
}

export const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const totalSales = state.sales.reduce((acc, s) => acc + s.total, 0);
  const totalPurchases = state.purchases.reduce((acc, p) => acc + p.total, 0);
  const totalExpenses = state.expenses.reduce((acc, e) => acc + e.amount, 0);
  
  const activeCash = state.cashRegisters.find(c => c.status === 'Abierta')?.currentBalance || 0;
  const totalBanks = state.bankAccounts.reduce((acc, b) => acc + b.balance, 0);
  const totalAR = state.accountsReceivable.reduce((acc, a) => acc + a.balance, 0);
  const totalAP = state.accountsPayable.reduce((acc, a) => acc + a.balance, 0);
  const inventoryValue = state.products.reduce((acc, p) => acc + (p.stock * (p.cost || p.buyPrice)), 0);
  
  const grossProfit = state.sales.reduce((acc, s) => {
    const saleCost = s.items.reduce((cAcc, it) => cAcc + (it.quantity * it.cost), 0);
    return acc + (s.subtotal - saleCost);
  }, 0);

  const netProfit = grossProfit - totalExpenses;

  const kpis = [
    { label: "Ventas Totales", value: `S/ ${totalSales.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, icon: ShoppingCart, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Compras Totales", value: `S/ ${totalPurchases.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, icon: ShoppingBag, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { label: "Utilidad Neta", value: `S/ ${netProfit.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Saldo en Caja", value: `S/ ${activeCash.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, icon: Wallet, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { label: "Bancos (Cuentas)", value: `S/ ${totalBanks.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, icon: Landmark, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
    { label: "Inventario Valorizado", value: `S/ ${inventoryValue.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, icon: Boxes, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
    { label: "Cuentas por Cobrar", value: `S/ ${totalAR.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, icon: FileText, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    { label: "Cuentas por Pagar", value: `S/ ${totalAP.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Gerencial en Tiempo Real</h1>
          <p className="text-sm text-slate-400 mt-1">Todas las áreas se actualizan automáticamente al registrar cualquier operación.</p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Motor Contable Sincronizado (Debe = Haber)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className={`bg-slate-900 border ${kpi.border} rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{kpi.label}</span>
                <div className={`p-2.5 rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-white tracking-tight">{kpi.value}</span>
                <div className="flex items-center space-x-1 text-[11px] text-emerald-400 mt-2 font-medium">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Actualizado en tiempo real</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <span>Últimas Operaciones Registradas</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Trazabilidad automática</span>
          </div>
          <div className="space-y-3">
            {state.sales.slice(0, 5).map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs">
                <div>
                  <p className="font-semibold text-white">Venta {sale.documentNumber}</p>
                  <p className="text-slate-400 text-[11px]">Forma de pago: {sale.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-400">+S/ {sale.total.toFixed(2)}</p>
                  <p className="text-[10px] text-slate-500">{new Date(sale.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {state.sales.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-6">No hay ventas registradas aún.</p>
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Boxes className="w-5 h-5 text-indigo-400" />
              <span>Stock Actual en Almacén</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Kardex activo</span>
          </div>
          <div className="space-y-3">
            {state.products.map((prod) => (
              <div key={prod.id} className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs">
                <div>
                  <p className="font-semibold text-white">{prod.name}</p>
                  <p className="text-slate-400 text-[11px]">SKU: {prod.sku} | Costo: S/ {prod.cost}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white text-sm">{prod.stock} {prod.unit}</p>
                  <p className="text-[10px] text-indigo-400">Valor: S/ {(prod.stock * prod.cost).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
