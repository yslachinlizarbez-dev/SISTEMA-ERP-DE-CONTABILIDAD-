import React, { useState } from 'react';
import { ERPState, User } from '../types/erp';
import { Users, Package, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

interface EntitiesViewProps {
  state: ERPState;
  currentUser: User;
  onRefresh: () => void;
}

export const EntitiesView: React.FC<EntitiesViewProps> = ({ state, currentUser, onRefresh }) => {
  const [tab, setTab] = useState<'customers' | 'suppliers' | 'products'>('customers');
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [sku, setSku] = useState('');
  const [sellPrice, setSellPrice] = useState(15);
  const [buyPrice, setBuyPrice] = useState(5);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    let endpoint = '/api/customers';
    let body: any = { name, docNumber, phone, email, address, user: currentUser.username };

    if (tab === 'suppliers') {
      endpoint = '/api/suppliers';
      body = { name, docNumber, contact: 'Contacto', phone, email, address, paymentTerms: '30 días', user: currentUser.username };
    } else if (tab === 'products') {
      endpoint = '/api/products';
      body = { sku, code: sku, name, description: name, category: 'General', brand: 'Gen', unit: 'Unidad', buyPrice: Number(buyPrice), sellPrice: Number(sellPrice), cost: Number(buyPrice), stock: 50, user: currentUser.username };
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear');
      setSuccess('¡Registro creado con éxito!');
      setShowModal(false);
      setName('');
      setDocNumber('');
      setPhone('');
      setEmail('');
      setAddress('');
      onRefresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Gestión de Clientes, Proveedores y Productos</h1>
          <p className="text-sm text-slate-400 mt-1">Directorio maestro de entidades del ERP.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button onClick={() => setTab('customers')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${tab === 'customers' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Clientes</button>
            <button onClick={() => setTab('suppliers')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${tab === 'suppliers' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Proveedores</button>
            <button onClick={() => setTab('products')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${tab === 'products' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Productos</button>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-blue-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Registro</span>
          </button>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {tab === 'customers' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Razón Social / Nombre</th>
                <th className="p-4">Documento (RUC/DNI)</th>
                <th className="p-4">Teléfono</th>
                <th className="p-4">Correo</th>
                <th className="p-4">Dirección</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {state.customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-bold text-white">{c.name}</td>
                  <td className="p-4 font-mono">{c.docNumber}</td>
                  <td className="p-4">{c.phone}</td>
                  <td className="p-4">{c.email}</td>
                  <td className="p-4 text-slate-400">{c.address}</td>
                  <td className="p-4"><span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-semibold">{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'suppliers' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Razón Social</th>
                <th className="p-4">RUC / Documento</th>
                <th className="p-4">Contacto</th>
                <th className="p-4">Teléfono</th>
                <th className="p-4">Correo</th>
                <th className="p-4">Condiciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {state.suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-bold text-white">{s.name}</td>
                  <td className="p-4 font-mono">{s.docNumber}</td>
                  <td className="p-4">{s.contact}</td>
                  <td className="p-4">{s.phone}</td>
                  <td className="p-4">{s.email}</td>
                  <td className="p-4 text-purple-400 font-semibold">{s.paymentTerms}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'products' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">SKU</th>
                <th className="p-4">Nombre del Producto</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Precio Compra</th>
                <th className="p-4">Precio Venta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {state.products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-mono font-bold text-white">{p.sku}</td>
                  <td className="p-4 font-medium text-white">{p.name}</td>
                  <td className="p-4 text-slate-400">{p.category}</td>
                  <td className="p-4 font-bold text-white">{p.stock} {p.unit}</td>
                  <td className="p-4 font-mono">S/ {p.buyPrice.toFixed(2)}</td>
                  <td className="p-4 font-mono text-emerald-400">S/ {p.sellPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Crear Nuevo {tab === 'customers' ? 'Cliente' : tab === 'suppliers' ? 'Proveedor' : 'Producto'}</h2>
            {error && <div className="mb-4 p-3 bg-red-500/10 text-red-400 text-xs rounded-xl">{error}</div>}
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              {tab === 'products' && (
                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">SKU</label>
                  <input type="text" required value={sku} onChange={(e) => setSku(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" placeholder="PRD-003" />
                </div>
              )}
              <div>
                <label className="block text-slate-400 uppercase font-semibold mb-1">{tab === 'products' ? 'Nombre del Producto' : 'Razón Social'}</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" placeholder="Nombre completo" />
              </div>
              {tab !== 'products' && (
                <>
                  <div>
                    <label className="block text-slate-400 uppercase font-semibold mb-1">RUC / Documento</label>
                    <input type="text" required value={docNumber} onChange={(e) => setDocNumber(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" placeholder="20123456789" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 uppercase font-semibold mb-1">Teléfono</label>
                      <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" placeholder="987654321" />
                    </div>
                    <div>
                      <label className="block text-slate-400 uppercase font-semibold mb-1">Correo</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" placeholder="correo@empresa.pe" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase font-semibold mb-1">Dirección</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" placeholder="Av. Principal 123" />
                  </div>
                </>
              )}
              {tab === 'products' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 uppercase font-semibold mb-1">Precio Compra (S/)</label>
                    <input type="number" step="0.01" value={buyPrice} onChange={(e) => setBuyPrice(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase font-semibold mb-1">Precio Venta (S/)</label>
                    <input type="number" step="0.01" value={sellPrice} onChange={(e) => setSellPrice(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" />
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-medium">Cancelar</button>
                <button type="submit" className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold">Guardar Registro</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
