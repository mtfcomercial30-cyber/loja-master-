
import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { UserRole, UserProfile } from './types';
import Layout from './components/Layout';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import SalesRegisters from './components/SalesRegisters';
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
      // Simulation of profile fetching since we don't have the table yet
      // In a real scenario: const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
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
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
