
import React, { useState } from 'react';
import { 
  Monitor, 
  Lock, 
  Unlock, 
  User, 
  Clock, 
  FileText,
  AlertTriangle,
  CreditCard,
  Banknote,
  CheckCircle
} from 'lucide-react';

const SalesRegisters: React.FC<{ role: string | undefined }> = ({ role }) => {
  const [registers, setRegisters] = useState([
    { id: '1', name: 'Caixa 01 - Frente', status: 'OPEN', operator: 'João Silva', opened_at: '2023-11-20T08:00:00', current_cash: 125000.40 },
    { id: '2', name: 'Caixa 02 - Frente', status: 'OPEN', operator: 'Maria Clara', opened_at: '2023-11-20T08:15:00', current_cash: 84000.20 },
    { id: '3', name: 'Caixa 03 - Rápido', status: 'CLOSED', operator: null, opened_at: null, current_cash: 0 },
    { id: '4', name: 'Caixa 04 - Rápido', status: 'CLOSED', operator: null, opened_at: null, current_cash: 0 },
  ]);

  const [selectedRegister, setSelectedRegister] = useState<any>(null);

  const toggleRegister = (id: string) => {
    setRegisters(registers.map(reg => {
      if (reg.id === id) {
        const isOpening = reg.status === 'CLOSED';
        return {
          ...reg,
          status: isOpening ? 'OPEN' : 'CLOSED',
          operator: isOpening ? 'Operador Admin' : null,
          opened_at: isOpening ? new Date().toISOString() : null,
          current_cash: isOpening ? 5000 : 0
        };
      }
      return reg;
    }));
  };

  const handleCloseConfirm = () => {
    toggleRegister(selectedRegister.id);
    setSelectedRegister(null);
    alert('Caixa fechado com sucesso. Relatório PDF gerado no servidor.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Monitoramento de Terminais</h1>
          <p className="text-slate-500">Acompanhamento de numerário e status dos operadores.</p>
        </div>
        <button className="w-full md:w-auto px-4 py-2 bg-slate-900 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
           <FileText size={18} />
           Histórico de Fechamentos
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {registers.map((reg) => (
          <div 
            key={reg.id}
            className={`bg-white rounded-3xl border-2 transition-all p-6 ${
              reg.status === 'OPEN' ? 'border-emerald-100 hover:border-emerald-200' : 'border-slate-100'
            }`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl ${reg.status === 'OPEN' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                <Monitor size={24} />
              </div>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
                reg.status === 'OPEN' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {reg.status === 'OPEN' ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            
            <h3 className="font-bold text-lg text-slate-800">{reg.name}</h3>
            
            {reg.status === 'OPEN' ? (
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <User size={14} />
                    <span>{reg.operator}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Clock size={14} />
                    <span>Início: {new Date(reg.opened_at!).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <div className="pt-4 border-t flex justify-between items-end">
                   <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Saldo Atual</p>
                      <p className="text-xl font-black text-slate-900">Kz {reg.current_cash.toLocaleString('pt-AO')}</p>
                   </div>
                   <button 
                    onClick={() => setSelectedRegister(reg)}
                    className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all active:scale-95"
                    title="Fechar Terminal"
                   >
                     <Lock size={18} />
                   </button>
                </div>
              </div>
            ) : (
              <div className="mt-8">
                 <button 
                  onClick={() => toggleRegister(reg.id)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                 >
                    <Unlock size={16} />
                    Abrir Terminal
                 </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedRegister && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-[60] animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
               <div>
                 <h3 className="text-xl font-bold">Fechamento Imutável</h3>
                 <p className="text-slate-400 text-xs">{selectedRegister.name}</p>
               </div>
               <button onClick={() => setSelectedRegister(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} />
               </button>
            </div>
            <div className="p-8 space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Esperado Cash</p>
                    <p className="text-lg font-black text-slate-900">Kz {selectedRegister.current_cash.toLocaleString('pt-AO')}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Esperado Digital</p>
                    <p className="text-lg font-black text-slate-900">Kz 0,00</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 ml-1">Total Físico em Mãos (Kz)</label>
                    <div className="relative">
                      <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="number" step="0.01" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 outline-none transition-all" placeholder="0,00" />
                    </div>
                  </div>
               </div>

               <div className="bg-amber-50 p-4 rounded-2xl flex gap-4 border-2 border-amber-100">
                  <AlertTriangle className="text-amber-600 shrink-0" size={24} />
                  <p className="text-xs text-amber-800 leading-relaxed font-medium">
                    A divergência será calculada automaticamente. Operação auditada por score de risco conforme diretrizes antifraude.
                  </p>
               </div>

               <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setSelectedRegister(null)}
                    className="flex-1 py-4 border-2 border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all active:scale-95"
                  >
                    Voltar
                  </button>
                  <button 
                    onClick={handleCloseConfirm}
                    className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-xl shadow-red-500/20 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Confirmar
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const X = ({size, className}: any) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;

export default SalesRegisters;
