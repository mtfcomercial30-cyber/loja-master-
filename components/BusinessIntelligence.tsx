
import React, { useState } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Lightbulb,
  ArrowRight,
  Info
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const projectionData = [
  { step: 0, profit: 15000 },
  { step: 1, profit: 16200 },
  { step: 2, profit: 17800 },
  { step: 3, profit: 19500 },
  { step: 4, profit: 18900 },
  { step: 5, profit: 18200 },
];

const BusinessIntelligence: React.FC<{ role: string | undefined }> = ({ role }) => {
  const [marginAdjust, setMarginAdjust] = useState(5);
  const [demandChange, setDemandChange] = useState(0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Simulador de Decisão e BI</h1>
          <p className="text-slate-500">Projete impactos financeiros antes de aplicar mudanças reais.</p>
        </div>
        <div className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg flex items-center gap-2">
            <Lightbulb size={18} />
            <span className="text-sm font-bold">Dica: Reprecificar Bebidas otimiza lucro em 4%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         {/* Simulator Controls */}
         <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
            <h3 className="text-lg font-bold border-b pb-4">Parâmetros de Simulação</h3>
            
            <div className="space-y-4">
               <div className="flex justify-between">
                  <label className="text-sm font-bold text-slate-700">Ajuste de Margem (%)</label>
                  <span className={`text-sm font-bold ${marginAdjust >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {marginAdjust > 0 ? '+' : ''}{marginAdjust}%
                  </span>
               </div>
               <input 
                  type="range" 
                  min="-20" 
                  max="20" 
                  value={marginAdjust} 
                  onChange={(e) => setMarginAdjust(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
               />
               <div className="flex justify-between text-xs text-slate-400">
                  <span>-20%</span>
                  <span>0%</span>
                  <span>+20%</span>
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex justify-between">
                  <label className="text-sm font-bold text-slate-700">Variação Estimada de Demanda</label>
                  <span className={`text-sm font-bold ${demandChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {demandChange > 0 ? '+' : ''}{demandChange}%
                  </span>
               </div>
               <input 
                  type="range" 
                  min="-30" 
                  max="30" 
                  value={demandChange} 
                  onChange={(e) => setDemandChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
               />
               <div className="flex justify-between text-xs text-slate-400">
                  <span>-30%</span>
                  <span>0%</span>
                  <span>+30%</span>
               </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl space-y-3">
               <p className="text-xs text-blue-800 font-medium">
                  A simulação utiliza dados históricos de sazonalidade e elasticidade-preço dos últimos 12 meses.
               </p>
               <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                  <Calculator size={18} />
                  Calcular Projeção
               </button>
            </div>
         </div>

         {/* Results Projection */}
         <div className="xl:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white p-6 rounded-2xl border border-slate-200">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Lucro Projetado (Mês)</p>
                  <div className="flex items-end gap-3">
                     <h4 className="text-3xl font-bold text-slate-900">R$ 58.420,00</h4>
                     <span className="text-emerald-600 font-bold mb-1 flex items-center text-sm">
                        <TrendingUp size={16} /> +15.2%
                     </span>
                  </div>
               </div>
               <div className="bg-white p-6 rounded-2xl border border-slate-200">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Impacto no Ticket Médio</p>
                  <div className="flex items-end gap-3">
                     <h4 className="text-3xl font-bold text-slate-900">R$ 142,50</h4>
                     <span className="text-red-600 font-bold mb-1 flex items-center text-sm">
                        <TrendingDown size={16} /> -2.4%
                     </span>
                  </div>
               </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 h-80">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold flex items-center gap-2">
                     <LineChart className="text-blue-500" />
                     Projeção de Curva de Lucratividade
                  </h3>
                  <div className="flex gap-4">
                     <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        Simulação Atual
                     </div>
                  </div>
               </div>
               <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={projectionData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="step" hide />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                        <Line type="monotone" dataKey="profit" stroke="#2563eb" strokeWidth={4} dot={{r: 6, fill: '#2563eb', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8}} />
                     </LineChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <InsightCard 
            title="Produtos Críticos (Loss Leaders)"
            description="Itens com margem negativa ou abaixo de 2% que não estão gerando fluxo cruzado."
            action="Revisar Fornecedor"
            impact="- R$ 2.400/mês"
         />
         <InsightCard 
            title="Oportunidade de Pack"
            description="Clientes que compram Macarrão têm 72% de chance de comprar Molho de Tomate."
            action="Criar Promoção Conjunta"
            impact="+ R$ 4.150/mês"
         />
         <InsightCard 
            title="Otimização de Horários"
            description="A fila no PDV 02 ultrapassa 8 minutos entre 17h e 19h nas sextas."
            action="Reforçar Escala"
            impact="Melhora NPS em 14%"
         />
      </div>
    </div>
  );
};

const InsightCard = ({ title, description, action, impact }: any) => (
   <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
      <div className="flex-1">
         <h4 className="font-bold text-slate-800 mb-2">{title}</h4>
         <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
      </div>
      <div className="mt-6 pt-4 border-t space-y-3">
         <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
            <span className="text-slate-400">Impacto Estimado</span>
            <span className="text-emerald-600">{impact}</span>
         </div>
         <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            {action}
            <ArrowRight size={14} />
         </button>
      </div>
   </div>
);

export default BusinessIntelligence;
