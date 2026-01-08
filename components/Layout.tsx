
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Calculator, 
  Users, 
  BarChart3, 
  ShieldAlert, 
  LogOut,
  Store,
  ShoppingCart,
  Menu,
  X
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    if(confirm('Deseja realmente sair do sistema?')) {
      await supabase.auth.signOut();
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.OWNER, UserRole.MANAGER, UserRole.AUDITOR] },
    { id: 'pdv', label: 'Vendas (PDV)', icon: ShoppingCart, roles: [UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER] },
    { id: 'inventory', label: 'Estoque', icon: Package, roles: [UserRole.OWNER, UserRole.MANAGER, UserRole.AUDITOR] },
    { id: 'sales', label: 'Monitor de Caixas', icon: Calculator, roles: [UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER] },
    { id: 'hr', label: 'RH & Equipe', icon: Users, roles: [UserRole.OWNER, UserRole.MANAGER] },
    { id: 'bi', label: 'Inteligência (BI)', icon: BarChart3, roles: [UserRole.OWNER] },
    { id: 'audit', label: 'Auditoria', icon: ShieldAlert, roles: [UserRole.OWNER, UserRole.AUDITOR] },
  ];

  const filteredMenu = menuItems.filter(item => profile && item.roles.includes(profile.role));

  const NavContent = () => (
    <>
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="p-2 bg-blue-600 rounded-lg">
          <Store className="text-white" size={24} />
        </div>
        <span className="font-bold text-xl tracking-tight">GestorPro <span className="text-blue-400">Retail</span></span>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredMenu.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                currentView === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
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
        <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-2xl mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white border-2 border-blue-400">
            {profile?.full_name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{profile?.full_name}</p>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">{profile?.role}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-bold text-sm"
        >
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar Desktop */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col hidden lg:flex border-r border-slate-800">
        <NavContent />
      </aside>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute top-0 left-0 w-80 h-full bg-slate-900 text-white flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            <NavContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Topbar */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm z-40">
            <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                >
                  <Menu size={24} />
                </button>
                <div className="hidden sm:flex flex-col">
                  <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Local: Matriz Luanda</h2>
                  <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    Servidor Online
                  </p>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-bold text-slate-900">{new Date().toLocaleDateString('pt-AO')}</p>
                  <p className="text-xs text-slate-500">{new Date().toLocaleTimeString('pt-AO', {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <ShieldAlert size={20} />
                </button>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
