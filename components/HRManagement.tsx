
import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  UserPlus, 
  Calendar, 
  FileSpreadsheet, 
  Search,
  MoreVertical,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

const mockEmployees = [
  { id: '1', name: 'João Silva', role: 'CASHIER', salary: 2200, status: 'PRESENT', entry: '08:02', exit: null },
  { id: '2', name: 'Maria Clara', role: 'CASHIER', salary: 2200, status: 'ABSENT', entry: null, exit: null },
  { id: '3', name: 'Ricardo Souza', role: 'MANAGER', salary: 4500, status: 'PRESENT', entry: '07:50', exit: null },
  { id: '4', name: 'Marta Lima', role: 'CASHIER', salary: 2200, status: 'PRESENT', entry: '08:15', exit: null },
];

const HRManagement: React.FC<{ role: string | undefined }> = ({ role }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Pessoas & Ponto</h1>
          <p className="text-slate-500">Controle de jornada, folha e performance de equipe.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-slate-50 text-slate-700 bg-white shadow-sm">
            <FileSpreadsheet size={18} />
            Folha de Pagamento (CSV)
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-lg">
            <UserPlus size={18} />
            Cadastrar Colaborador
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <HRStat label="Presentes Agora" value="12" total="15" color="emerald" />
         <HRStat label="Atrasos Hoje" value="2" total="15" color="amber" />
         <HRStat label="Faltas injustificadas" value="1" total="15" color="red" />
         <HRStat label="Horas Extras (Mês)" value="42h" total="" color="blue" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
         <div className="p-4 border-b bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input 
                  type="text" 
                  placeholder="Buscar colaborador..." 
                  className="w-full pl-10 pr-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
               <Calendar size={18} />
               <span>Hoje, 20 de Novembro</span>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50 border-b">
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Colaborador</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Cargo</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Entrada</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Saída</th>
                     <th className="px-6 py-4"></th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {mockEmployees.map(emp => (
                     <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                 {emp.name.charAt(0)}
                              </div>
                              <span className="font-bold text-slate-800">{emp.name}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-700 rounded uppercase">
                              {emp.role}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              emp.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                           }`}>
                              <span className={`w-2 h-2 rounded-full ${emp.status === 'PRESENT' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                              {emp.status === 'PRESENT' ? 'Logado' : 'Ausente'}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-center text-sm font-medium text-slate-600">
                           {emp.entry || '--:--'}
                        </td>
                        <td className="px-6 py-4 text-center text-sm font-medium text-slate-600">
                           {emp.exit || '--:--'}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button className="p-2 text-slate-400 hover:text-slate-600">
                              <MoreVertical size={18} />
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

const HRStat = ({ label, value, total, color }: any) => {
   const colors: any = {
      emerald: 'bg-emerald-50 text-emerald-600',
      amber: 'bg-amber-50 text-amber-600',
      red: 'bg-red-50 text-red-600',
      blue: 'bg-blue-50 text-blue-600'
   };

   return (
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
         <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">{label}</p>
         <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold ${colors[color].split(' ')[1]}`}>{value}</span>
            {total && <span className="text-slate-400 font-medium">/ {total}</span>}
         </div>
      </div>
   );
};

export default HRManagement;
