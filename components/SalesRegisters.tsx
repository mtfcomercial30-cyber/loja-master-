
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
  Banknote
} from 'lucide-react';

const mockRegisters = [
  { id: '1', name: 'Caixa 01 - Frente', status: 'OPEN', operator: 'João Silva', opened_at: '2023-11-20T08:00:00', current_cash: 125000.40 },
  { id: '2', name: 'Caixa 02 - Frente', status: 'OPEN', operator: 'Maria Clara', opened_at: '2023-11-20T08:15:00', current_cash: 84000.20 },
  { id: '3', name: 'Caixa 03 - Rápido', status: 'CLOSED', operator: null, opened_at: null, current_cash: 0 },
  { id: '4', name: 'Caixa 04 - Rápido', status: 'OPEN', operator: 'Ricardo Souza', opened_at: '2023-11-20T10:00:00', current_cash: 45000.00 },
];

const SalesRegisters: React.FC<{ role: string | undefined }> = ({ role }) => {
  const [selectedRegister, setSelectedRegister] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Monitoramento de Caixas</h1>
          <p className="text-slate-500">Acompanhamento em tempo real de operadores e numerário em Kwanzas.</p>
        </div>
        <button className="px-4 py-2 bg-slate-900 text-white rounded-lg flex items-center gap-2 hover:bg-slate-800">
           <Monitor size={18} />
           Histórico de Fechamentos
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {mockRegisters.map((reg) => (
          <div 
            key={reg.id}
            className={`bg-white rounded-2xl border-2 transition-all p-6 ${
              reg.status === 'OPEN' ? 'border-emerald-100 hover:border-emerald-300' : 'border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${reg.status === 'OPEN' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                <Monitor size={24} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                reg.status === 'OPEN' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {reg.status === 'OPEN' ? 'Aberto' : 'Fechado'}
              </span>
            </div>
            
            <h3 className="font-bold text-lg mb-1">{reg.name}</h3>
            
            {reg.status === 'OPEN' ? (
              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <User size={16} />
                  <span>{reg.operator}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock size={16} />
                  <span>Início: {new Date(reg.opened_at!).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="pt-4 border-t mt-4 flex justify-between items-end">
                   <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Em Dinheiro</p>
                      <p className="text-xl font-bold text-slate-900">Kz {reg.current_cash.toLocaleString('pt-AO')}</p>
                   </div>
                   <button 
                    onClick={() => setSelectedRegister(reg)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    title="Fechar Caixa"
                   >
                     <Lock size={18} />
                   </button>
                </div>
              </div>
            ) : (
              <div className="mt-8 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl">
                 <p className="text-sm text-slate-400 mb-4 italic">Sem atividade no momento</p>
                 <button className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Unlock size={16} />
                    Abrir Caixa
                 </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Closing Modal Logic (Simplified) */}
      {selectedRegister && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
               <h3 className="text-xl font-bold">Fechamento Imutável: {selectedRegister.name}</h3>
               <button onClick={() => setSelectedRegister(null)} className="text-slate-400 hover:text-white">X</button>
            </div>
            <div className="p-6 space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-2">Esperado em Dinheiro</p>
                    <p className="text-lg font-bold">Kz {selectedRegister.current_cash.toLocaleString('pt-AO')}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-2">Esperado em Cartões</p>
                    <p className="text-lg font-bold">Kz {(selectedRegister.current_cash * 3).toLocaleString('pt-AO')}</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Total Informado (Dinheiro)</label>
                    <div className="relative">
                      <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="number" step="0.01" className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none" placeholder="0,00" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Total Informado (Cartões/Pix)</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="number" step="0.01" className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none" placeholder="0,00" />
                    </div>
                  </div>
               </div>

               <div className="bg-amber-50 p-4 rounded-xl flex gap-3 border border-amber-200">
                  <AlertTriangle className="text-amber-600 flex-shrink-0" size={20} />
                  <p className="text-xs text-amber-800">
                    O fechamento de caixa é uma operação <strong>crítica</strong> e <strong>definitiva</strong>. Qualquer divergência acima de Kz 500,00 será notificada automaticamente à gerência e impactará o score de risco do operador.
                  </p>
               </div>

               <div className="flex gap-4">
                  <button 
                    onClick={() => setSelectedRegister(null)}
                    className="flex-1 py-3 border rounded-xl font-bold hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20">
                    Confirmar & Gerar PDF
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Register Summary BI */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
         <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <FileText className="text-blue-500" />
            Últimos Fechamentos Realizados
         </h3>
         <div className="overflow-x-auto">
            <table className="w-full text-sm">
               <thead>
                  <tr className="text-slate-400 text-left border-b">
                     <th className="pb-4 font-bold uppercase tracking-wider">Data/Hora</th>
                     <th className="pb-4 font-bold uppercase tracking-wider">Responsável</th>
                     <th className="pb-4 font-bold uppercase tracking-wider">Diferença</th>
                     <th className="pb-4 font-bold uppercase tracking-wider">Status</th>
                     <th className="pb-4"></th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  <tr className="hover:bg-slate-50">
                     <td className="py-4 font-medium text-slate-700">20/11 - 18:30</td>
                     <td className="py-4">Marta Lima</td>
                     <td className="py-4 text-emerald-600 font-bold">Kz 0,00</td>
                     <td className="py-4">
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">CONCILIADO</span>
                     </td>
                     <td className="py-4 text-right">
                        <button className="text-blue-600 hover:underline">Ver PDF</button>
                     </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                     <td className="py-4 font-medium text-slate-700">20/11 - 17:45</td>
                     <td className="py-4">Carlos Abreu</td>
                     <td className="py-4 text-red-600 font-bold">Kz -1.420,00</td>
                     <td className="py-4">
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">DIVERGENTE</span>
                     </td>
                     <td className="py-4 text-right">
                        <button className="text-blue-600 hover:underline">Ver PDF</button>
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default SalesRegisters;
