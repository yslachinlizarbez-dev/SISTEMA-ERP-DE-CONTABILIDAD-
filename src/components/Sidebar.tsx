import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  ShoppingBag,
  Package,
  Boxes,
  Wallet,
  Landmark,
  FileText,
  DollarSign,
  Briefcase,
  BookOpen,
  PieChart,
  ShieldCheck,
  Building2,
  Users,
  Settings,
  ListOrdered,
  Scale
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuSections = [
    {
      title: "Principal",
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: "Operaciones Comerciales",
      items: [
        { id: 'sales', label: 'Ventas y Facturación', icon: ShoppingCart },
        { id: 'purchases', label: 'Compras', icon: ShoppingBag },
        { id: 'inventory', label: 'Inventario & Kardex', icon: Boxes },
        { id: 'products', label: 'Catálogo Productos', icon: Package }
      ]
    },
    {
      title: "Tesorería & Finanzas",
      items: [
        { id: 'cash', label: 'Caja & Movimientos', icon: Wallet },
        { id: 'banks', label: 'Bancos & Cuentas', icon: Landmark },
        { id: 'receivable', label: 'Cuentas por Cobrar', icon: FileText },
        { id: 'payable', label: 'Cuentas por Pagar', icon: FileText },
        { id: 'expenses', label: 'Gastos Operativos', icon: DollarSign },
        { id: 'assets', label: 'Activos Fijos', icon: Briefcase }
      ]
    },
    {
      title: "Motor Contable",
      items: [
        { id: 'chart', label: 'Plan Contable', icon: BookOpen },
        { id: 'journal', label: 'Libro Diario', icon: ListOrdered },
        { id: 'ledger', label: 'Libro Mayor', icon: BookOpen },
        { id: 'trial', label: 'Balance de Comprobación', icon: Scale },
        { id: 'financial', label: 'Estados Financieros', icon: PieChart },
        { id: 'closing', label: 'Cierre Contable', icon: ShieldCheck }
      ]
    },
    {
      title: "Gestión & Auditoría",
      items: [
        { id: 'entities', label: 'Clientes & Proveedores', icon: Users },
        { id: 'audit', label: 'Auditoría & Trazabilidad', icon: ShieldCheck },
        { id: 'test', label: 'Prueba Integral 9 Pasos', icon: Settings }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-4 space-y-6">
        {menuSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">{section.title}</h3>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition duration-150 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
};
