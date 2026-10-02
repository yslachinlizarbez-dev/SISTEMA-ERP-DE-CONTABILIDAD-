import React from 'react';
import { User, Company } from '../types/erp';
import { Building, User as UserIcon, LogOut, RotateCcw, PlayCircle, Shield } from 'lucide-react';

interface NavbarProps {
  company: Company;
  currentUser: User;
  onLogout: () => void;
  onResetSystem: () => void;
  onRunTestScenario: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  company,
  currentUser,
  onLogout,
  onResetSystem,
  onRunTestScenario
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 h-16 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">{company.razonSocial}</h1>
            <p className="text-xs text-slate-400 font-mono">RUC: {company.ruc} | Moneda: {company.moneda}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={onRunTestScenario}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-lg shadow-emerald-600/20 transition"
          title="Ejecutar la prueba integral de 9 pasos solicitada"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Prueba Integral 9 Pasos</span>
        </button>

        <button
          onClick={onResetSystem}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition"
          title="Reiniciar datos del sistema"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reiniciar</span>
        </button>

        <div className="h-6 w-px bg-slate-800"></div>

        <div className="flex items-center space-x-3 bg-slate-950/50 border border-slate-800/80 rounded-xl px-3 py-1.5">
          <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <UserIcon className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-xs font-medium text-white leading-none">{currentUser.name}</p>
            <p className="text-[10px] text-slate-400 mt-0.5 flex items-center space-x-1">
              <Shield className="w-3 h-3 text-emerald-400 inline" />
              <span>{currentUser.role}</span>
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition"
          title="Cerrar Sesión"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
