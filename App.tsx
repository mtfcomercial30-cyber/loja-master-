
import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { UserRole, UserProfile } from './types';
import Layout from './components/Layout';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import SalesRegisters from './components/SalesRegisters';
import PDV from './components/PDV';
import HRManagement from './components/HRManagement';
import BusinessIntelligence from './components/BusinessIntelligence';
import AuditHistory from './components/AuditHistory';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      // Perfil simulado para o admin
      const mockProfile: UserProfile = {
        id: userId,
        email: 'dono@loja.com',
        full_name: 'Proprietário Gestor',
        role: UserRole.OWNER,
        risk_score: 0,
      };
      setProfile(mockProfile);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-blue-600">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current"></div>
          <span className="font-bold animate-pulse">Iniciando GestorPro...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard profile={profile} />;
      case 'inventory': return <Inventory role={profile?.role} />;
      case 'pdv': return <PDV />;
      case 'sales': return <SalesRegisters role={profile?.role} />;
      case 'hr': return <HRManagement role={profile?.role} />;
      case 'bi': return <BusinessIntelligence role={profile?.role} />;
      case 'audit': return <AuditHistory role={profile?.role} />;
      default: return <Dashboard profile={profile} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView} profile={profile}>
      {renderView()}
    </Layout>
  );
};

export default App;
