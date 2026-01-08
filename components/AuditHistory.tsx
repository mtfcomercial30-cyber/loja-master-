
import React from 'react';
import { 
  ShieldAlert, 
  History, 
  Search, 
  Download, 
  AlertCircle,
  Eye,
  TrendingUp,
  UserX
} from 'lucide-react';

const mockLogs = [
  { id: '1', user: 'Ricardo Souza', action: 'PRICE_OVERRIDE', target: 'Whisky Red Label', original: 'R$ 119.00', new: 'R$ 89.00', severity: 'HIGH', time: '10:42' },
  { id: '2', user: 'João Silva', action: 'CANCELLATION', target: 'Cupom #8842', original: 'R$ 452.00', severity: 'MEDIUM', time: '09:15' },
  { id: '3', user: 'Sistema', action: 'STOCK_ADJUSTMENT', target: 'Filet Mignon 1kg', original: '45.2kg', new: '42.0kg', severity: 'LOW', time: '08:00' },
  { id: '4', user: 'Maria Clara', action: 'REFUND', target: 'Vinho Chileno', original: 'R$ 54.00', severity: 'HIGH', time: '14:22' },
];

const AuditHistory: React.FC<{ role: string | undefined }> = ({ role }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldAlert className="text-red-600" />
            Central de Auditoria & Prevenção de Fraude
          </h1>
          <p className="text-slate-500">Monitoramento contínuo de ações críticas e risco operacional.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 border rounded-lg bg-white flex items-center gap-2">
              <History size={18} />
              Exportar Trilha
           </button>
        </div>
      </div>

      {/* Risk Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
               <h4 className="font-bold text-slate-700">Funcionários de Alto Risco</h4>
               <UserX className="text-red-500" />
            </div>
            <div className="mt-4 space-y-4">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold">RS</div>
                  <div className="flex-1">
                     <p className="text-sm font-bold">Ricardo Souza</p>
                     <p className="text-xs text-slate-400">Score: 88/100 (Crítico)</p>
                  </div>
                  <div className="h-2 w-16 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-red-500 w-4/5"></div>
                  </div>
               </div>
               <div className="flex items-center gap-3 opacity-60">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold">JS</div>
                  <div className="flex-1">
                     <p className="text-sm font-bold">João Silva</p>
                     <p className="text-xs text-slate-400">Score: 42/100 (Médio)</p>
                  </div>
                  <div className="h-2 w-16 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-amber-500 w-2/5"></div>
                  </div>
               </div>
            </div>
         </div>

         <div className="lg:col-span-2 bg-slate-900 text-white p-6 rounded-2xl relative overflow-hidden">
            <div className="relative z-10 flex h-full items-center justify-between">
               <div className="max-w-md">
                  <h4 className="text-xl font-bold mb-2 flex items-center gap-2">
                     <TrendingUp className="text-emerald-400" />
                     Relatório de Perdas Mensal
                  </h4>
                  <p className="text-slate-400 text-sm mb-4">
                     As perdas por quebra e divergência reduziram <span className="text-emerald-400 font-bold">12%</span> em relação ao mês anterior após a implementação das travas de preço.
                  </p>
                  <button className="text-blue-400 text-sm font-bold hover:underline">Ver análise detalhada →</button>
               </div>
               <div className="text-right">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Impacto Financeiro</p>
                  <p className="text-4xl font-bold text-white">R$ 12.840,00</p>
               </div>
            </div>
         </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
         <div className="p-4 border-b bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input 
                  type="text" 
                  placeholder="Filtrar logs por operador ou produto..." 
                  className="w-full pl-10 pr-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
               <select className="px-4 py-2 border rounded-lg bg-white text-sm outline-none">
                  <option>Todas as Severidades</option>
                  <option>Apenas Críticas</option>
               </select>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50 border-b">
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Hora</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Operador</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Ação</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Alvo</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Valores</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Risco</th>
                     <th className="px-6 py-4"></th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {mockLogs.map(log => (
                     <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-500">{log.time}</td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-800">{log.user}</td>
                        <td className="px-6 py-4">
                           <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-600 border uppercase">
                              {log.action.replace('_', ' ')}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{log.target}</td>
                        <td className="px-6 py-4">
                           <div className="text-xs text-slate-400">De: <span className="line-through">{log.original}</span></div>
                           {log.new && <div className="text-sm font-bold text-red-600">Para: {log.new}</div>}
                        </td>
                        <td className="px-6 py-4 text-center">
                           <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              log.severity === 'HIGH' ? 'bg-red-100 text-red-700' :
                              log.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                              'bg-blue-100 text-blue-700'
                           }`}>
                              {log.severity === 'HIGH' && <AlertCircle size={12} />}
                              {log.severity}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                              <Eye size={18} />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default AuditHistory;
