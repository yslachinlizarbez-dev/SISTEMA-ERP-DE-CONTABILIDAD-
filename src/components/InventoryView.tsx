import React from 'react';
import { ERPState } from '../types/erp';
import { Boxes, Package, History } from 'lucide-react';

interface InventoryViewProps {
  state: ERPState;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ state }) => {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Control de Inventario & Kardex</h1>
        <p className="text-sm text-slate-400 mt-1">Monitorea en tiempo real el stock, valoración de inventario y movimientos (entradas y salidas).</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Package className="w-5 h-5 text-indigo-400" />
            <span>Inventario Actual Valorizado</span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">SKU</th>
                <th className="p-4">Producto</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Stock Actual</th>
                <th className="p-4">Costo Unitario</th>
                <th className="p-4">Valor Total</th>
                <th className="p-4">Precio Venta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {state.products.map((prod) => {
                const totalVal = prod.stock * (prod.cost || prod.buyPrice);
                return (
                  <tr key={prod.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-mono font-bold text-white">{prod.sku}</td>
                    <td className="p-4 font-medium text-white">{prod.name}</td>
                    <td className="p-4 text-slate-400">{prod.category}</td>
                    <td className="p-4 font-bold text-white">{prod.stock} {prod.unit}</td>
                    <td className="p-4 font-mono">S/ {(prod.cost || prod.buyPrice).toFixed(2)}</td>
                    <td className="p-4 font-mono font-bold text-indigo-400">S/ {totalVal.toFixed(2)}</td>
                    <td className="p-4 font-mono text-emerald-400">S/ {prod.sellPrice.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <History className="w-5 h-5 text-cyan-400" />
            <span>Kardex / Movimientos de Almacén</span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Fecha</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Producto</th>
                <th className="p-4">Cantidad</th>
                <th className="p-4">Costo Unitario</th>
                <th className="p-4">Costo Total</th>
                <th className="p-4">Referencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {state.inventoryMovements.map((mov) => {
                const prod = state.products.find(p => p.id === mov.productId);
                return (
                  <tr key={mov.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4">{new Date(mov.date).toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-lg font-semibold text-[10px] ${
                        mov.type.includes('ENTRADA') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {mov.type}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-white">{prod ? prod.name : mov.productId}</td>
                    <td className="p-4 font-bold">{mov.quantity}</td>
                    <td className="p-4 font-mono">S/ {mov.unitCost.toFixed(2)}</td>
                    <td className="p-4 font-mono">S/ {mov.totalCost.toFixed(2)}</td>
                    <td className="p-4 text-slate-400 font-mono">{mov.reference}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
