import React, { useState, useEffect } from 'react';
import { ERPState, User } from './types/erp';
import { LoginModal } from './components/LoginModal';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SalesView } from './components/SalesView';
import { PurchasesView } from './components/PurchasesView';
import { InventoryView } from './components/InventoryView';
import { CashBankView } from './components/CashBankView';
import { CxCxPView } from './components/CxCxPView';
import { AccountingView } from './components/AccountingView';
import { EntitiesView } from './components/EntitiesView';
import { AssetsExpensesView } from './components/AssetsExpensesView';
import { AuditView } from './components/AuditView';
import { TestScenarioView } from './components/TestScenarioView';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [state, setState] = useState<ERPState | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  const fetchState = async () => {
    try {
      const res = await fetch('/api/state');
      const data = await res.json();
      setState(data);
      if (!currentUser && data.users && data.users.length > 0) {
        // Default to admin user for convenience or require login
      }
    } catch (err) {
      console.error('Error fetching state', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const handleResetSystem = async () => {
    if (!window.confirm('¿Estás seguro de reiniciar el sistema ERP a su estado inicial?')) return;
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setState(data.db);
        alert('¡Sistema reiniciado correctamente!');
      }
    } catch (err) {
      alert('Error al reiniciar sistema');
    }
  };

  const handleRunTestScenario = async () => {
    try {
      const res = await fetch('/api/test-scenario', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchState();
        alert(data.message);
        setActiveTab('financial');
      }
    } catch (err) {
      alert('Error al ejecutar prueba integral');
    }
  };

  if (loading || !state) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginModal users={state.users} onLogin={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      <Navbar
        company={state.company}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
        onResetSystem={handleResetSystem}
        onRunTestScenario={handleRunTestScenario}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto bg-slate-950">
          {activeTab === 'dashboard' && <Dashboard state={state} />}
          {activeTab === 'sales' && <SalesView state={state} currentUser={currentUser} onRefresh={fetchState} />}
          {activeTab === 'purchases' && <PurchasesView state={state} currentUser={currentUser} onRefresh={fetchState} />}
          {activeTab === 'inventory' && <InventoryView state={state} />}
          {activeTab === 'cash' && <CashBankView state={state} currentUser={currentUser} onRefresh={fetchState} />}
          {activeTab === 'banks' && <CashBankView state={state} currentUser={currentUser} onRefresh={fetchState} />}
          {activeTab === 'receivable' && <CxCxPView state={state} currentUser={currentUser} onRefresh={fetchState} />}
          {activeTab === 'payable' && <CxCxPView state={state} currentUser={currentUser} onRefresh={fetchState} />}
          {activeTab === 'expenses' && <AssetsExpensesView state={state} currentUser={currentUser} onRefresh={fetchState} />}
          {activeTab === 'assets' && <AssetsExpensesView state={state} currentUser={currentUser} onRefresh={fetchState} />}
          {activeTab === 'chart' && <AccountingView state={state} currentUser={currentUser} onRefresh={fetchState} />}
          {activeTab === 'journal' && <AccountingView state={state} currentUser={currentUser} onRefresh={fetchState} />}
          {activeTab === 'ledger' && <AccountingView state={state} currentUser={currentUser} onRefresh={fetchState} />}
          {activeTab === 'trial' && <AccountingView state={state} currentUser={currentUser} onRefresh={fetchState} />}
          {activeTab === 'financial' && <AccountingView state={state} currentUser={currentUser} onRefresh={fetchState} />}
          {activeTab === 'closing' && <AccountingView state={state} currentUser={currentUser} onRefresh={fetchState} />}
          {activeTab === 'entities' && <EntitiesView state={state} currentUser={currentUser} onRefresh={fetchState} />}
          {activeTab === 'audit' && <AuditView state={state} />}
          {activeTab === 'test' && <TestScenarioView state={state} onRefresh={fetchState} />}
        </main>
      </div>
    </div>
  );
}
