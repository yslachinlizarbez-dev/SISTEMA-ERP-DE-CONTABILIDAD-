import React, { useState } from 'react';
import { ERPState, Sale, Customer, Product, User } from '../types/erp';
import { ShoppingCart, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

interface SalesViewProps {
  state: ERPState;
  currentUser: User;
  onRefresh: () => void;
}

export const SalesView: React.FC<SalesViewProps> = ({ state, currentUser, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [customerId, setCustomerId] = useState(state.customers[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [productId, setProductId] = useState(state.products[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(state.products[0]?.sellPrice || 15);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleProductChange = (pId: string) => {
    setProductId(pId);
    const p = state.products.find(prod => prod.id === pId);
    if (p) setUnitPrice(p.sellPrice);
  };

  const handleCreateSale = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          paymentMethod,
          items: [{ productId, quantity: Number(quantity), unitPrice: Number(unitPrice) }],
          user: currentUser.username
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al registrar venta');
      
      setSuccess(`¡Venta ${data.sale.documentNumber} registrada con éxito! Inventario, caja/CxC, costos y asientos contables actualizados automáticamente.`);
      setShowModal(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Módulo de Ventas & Facturación</h1>
          <p className="text-sm text-slate-400 mt-1">Registra ventas y el sistema actualizará inventario, caja/CxC, impuestos y asientos contables.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-blue-600/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Venta</span>
        </button>
      </div>

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-blue-400" />
            <span>Historial de Ventas Registradas</span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Documento</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Pago</th>
                <th className="p-4">Subtotal</th>
                <th className="p-4">IGV (18%)</th>
                <th className="p-4">Total</th>
                <th className="p-4">Usuario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {state.sales.map((sale) => {
                const cust = state.customers.find(c => c.id === sale.customerId);
                return (
                  <tr key={sale.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-mono font-bold text-white">{sale.documentNumber}</td>
                    <td className="p-4">{new Date(sale.date).toLocaleString()}</td>
                    <td className="p-4 font-medium text-white">{cust ? cust.name : sale.customerId}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 font-semibold">{sale.paymentMethod}</span>
                    </td>
                    <td className="p-4 font-mono">S/ {sale.subtotal.toFixed(2)}</td>
                    <td className="p-4 font-mono">S/ {sale.tax.toFixed(2)}</td>
                    <td className="p-4 font-mono font-bold text-emerald-400">S/ {sale.total.toFixed(2)}</td>
                    <td className="p-4 text-slate-400">{sale.user}</td>
                  </tr>
                );
              })}
              {state.sales.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">No hay ventas registradas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Registrar Nueva Venta</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateSale} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 uppercase font-semibold mb-1">Cliente</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                >
                  {state.customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.docNumber})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-semibold mb-1">Producto</label>
                <select
                  value={productId}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                >
                  {state.products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock} | Precio: S/{p.sellPrice})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Precio Unitario (S/)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-semibold mb-1">Forma de Pago</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Efectivo">Efectivo (Ingresa a Caja)</option>
                  <option value="Crédito">Crédito (Genera Cuenta por Cobrar)</option>
                </select>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1 text-slate-300">
                <p>Subtotal: S/ {(quantity * unitPrice).toFixed(2)}</p>
                <p>IGV (18%): S/ {((quantity * unitPrice) * 0.18).toFixed(2)}</p>
                <p className="text-white font-bold text-sm">Total: S/ {((quantity * unitPrice) * 1.18).toFixed(2)}</p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/20"
                >
                  Confirmar Venta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
