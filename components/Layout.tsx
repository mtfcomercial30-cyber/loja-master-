
import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Calculator, 
  Users, 
  BarChart3, 
  ShieldAlert, 
  LogOut,
  Store
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { UserRole, UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  setView: (view: string) => void;
  profile: UserProfile | null;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, profile }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.OWNER, UserRole.MANAGER, UserRole.AUDITOR] },
    { id: 'inventory', label: 'Estoque', icon: Package, roles: [UserRole.OWNER, UserRole.MANAGER, UserRole.AUDITOR] },
    { id: 'sales', label: 'Caixas & Vendas', icon: Calculator, roles: [UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER] },
    { id: 'hr', label: 'RH & Ponto', icon: Users, roles: [UserRole.OWNER, UserRole.MANAGER] },
    { id: 'bi', label: 'Inteligência (BI)', icon: BarChart3, roles: [UserRole.OWNER] },
    { id: 'audit', label: 'Auditoria & Risco', icon: ShieldAlert, roles: [UserRole.OWNER, UserRole.AUDITOR] },
  ];

  const filteredMenu = menuItems.filter(item => profile && item.roles.includes(profile.role));

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <Store className="text-blue-400" size={32} />
          <span className="font-bold text-xl tracking-tight">GestorPro <span className="text-blue-400">Retail</span></span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredMenu.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentView === item.id 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">
              {profile?.full_name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{profile?.full_name}</p>
              <p className="text-xs text-slate-400 uppercase">{profile?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Topbar for mobile */}
        <header className="md:hidden bg-white border-b p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Store className="text-blue-600" size={24} />
                <span className="font-bold">GestorPro</span>
            </div>
            <button className="p-2 bg-slate-100 rounded-md">
                <LogOut size={20} className="text-slate-600" />
            </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
            {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
