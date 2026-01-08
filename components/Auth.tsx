
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Store, ShieldCheck, Lock, Mail, AlertCircle } from 'lucide-react';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Credenciais inválidas. Verifique seu acesso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 mb-6">
               <Store className="text-white" size={36} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 text-center">GestorPro <span className="text-blue-600">Admin</span></h1>
            <p className="text-slate-500 text-center mt-2">Sistema Restrito para Administração da Loja</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm animate-in shake duration-300">
                <AlertCircle size={20} className="shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">E-mail Administrativo</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all"
                  placeholder="admin@sualoja.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-slate-700">Senha de Acesso</label>
                <button type="button" className="text-xs text-blue-600 font-bold hover:underline">Esqueci minha senha</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <ShieldCheck size={20} />
                  Acessar Painel
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t text-center">
             <p className="text-xs text-slate-400 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
                <Lock size={12} />
                Ambiente 256-bit Seguro
             </p>
          </div>
        </div>
        <p className="text-slate-500 text-sm text-center mt-8">
           © 2023 GestorPro Retail. Versão 2.4.0-Enterprise
        </p>
      </div>
    </div>
  );
};

export default Auth;
