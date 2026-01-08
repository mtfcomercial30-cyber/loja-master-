
import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  PackageSearch, 
  AlertTriangle, 
  Users2, 
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { UserProfile } from '../types';

const salesData = [
  { time: '08:00', sales: 1200 },
  { time: '10:00', sales: 2800 },
  { time: '12:00', sales: 4500 },
  { time: '14:00', sales: 3200 },
  { time: '16:00', sales: 5800 },
  { time: '18:00', sales: 7500 },
  { time: '20:00', sales: 4100 },
];

const profitData = [
  { month: 'Jan', revenue: 45000, profit: 12000 },
  { month: 'Fev', revenue: 52000, profit: 15000 },
  { month: 'Mar', revenue: 48000, profit: 11000 },
  { month: 'Abr', revenue: 61000, profit: 19000 },
  { month: 'Mai', revenue: 55000, profit: 14000 },
  { month: 'Jun', revenue: 67000, profit: 21000 },
];

const Dashboard: React.FC<{ profile: UserProfile | null }> = ({ profile }) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Bem-vindo, {profile?.full_name}</h1>
        <p className="text-slate-500">Aqui está o resumo operacional da sua loja hoje.</p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Receita Hoje" 
          value="R$ 14.502,30" 
          trend="+12%" 
          trendType="up"
          icon={DollarSign}
          color="blue"
        />
        <StatCard 
          title="Lucro Real (Mês)" 
          value="R$ 42.180,00" 
          trend="+5.4%" 
          trendType="up"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard 
          title="Caixas Abertos" 
          value="6 / 8" 
          description="2 operadores em intervalo"
          icon={Calculator}
          color="amber"
        />
        <StatCard 
          title="Alertas Críticos" 
          value="4" 
          description="Estoque e divergências"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Clock className="text-blue-500" size={20} />
              Pico de Vendas por Horário
            </h3>
            <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded uppercase">Tempo Real</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="text-emerald-500" size={20} />
              Crescimento de Lucro vs Receita
            </h3>
            <select className="text-sm bg-slate-50 border-none outline-none focus:ring-0 cursor-pointer rounded px-2 py-1">
                <option>Últimos 6 meses</option>
                <option>Este ano</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                <Bar dataKey="revenue" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Alerts & Critical Info */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <AlertTriangle className="text-amber-500" size={20} />
              Alertas de Risco e Divergência
            </h3>
            <button className="text-blue-600 text-sm font-medium hover:underline">Ver tudo</button>
          </div>
          <div className="divide-y">
            <RiskAlert 
              type="stock" 
              message="Divergência de inventário no setor de Bebidas (Lote #442)" 
              impact="R$ -1.240,00"
              severity="high"
            />
            <RiskAlert 
              type="hr" 
              message="Comportamento anômalo identificado no PDV 04 (Cancelamento excessivo)" 
              impact="Funcionário: João Silva"
              severity="medium"
            />
            <RiskAlert 
              type="expiry" 
              message="12 itens vencem em 48h na categoria Laticínios" 
              impact="Ação sugerida: Promoção Relâmpago"
              severity="medium"
            />
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden">
           <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4">Sugestão do BI</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Reprecificar produtos da categoria <span className="text-white font-bold">Hortifruti</span> em 5.2% baseado na variação do fornecedor aumentará sua margem mensal em aproximadamente:
              </p>
              <div className="text-3xl font-bold text-blue-400 mb-8">R$ 8.420,00</div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold transition-all transform active:scale-95">
                Simular Impacto
              </button>
           </div>
           <div className="absolute -bottom-10 -right-10 opacity-10">
              <TrendingUp size={240} />
           </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend, trendType, description, icon: Icon, color }: any) => {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`flex items-center text-sm font-bold ${trendType === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend}
            {trendType === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          </div>
        )}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h4 className="text-2xl font-bold text-slate-900 mt-1">{value}</h4>
        {description && <p className="text-slate-400 text-xs mt-1">{description}</p>}
      </div>
    </div>
  );
};

const RiskAlert = ({ type, message, impact, severity }: any) => {
  const severityColors: any = {
    high: 'bg-red-500',
    medium: 'bg-amber-500',
    low: 'bg-blue-500'
  };

  return (
    <div className="p-4 flex gap-4 hover:bg-slate-50 transition-colors">
      <div className={`w-1.5 rounded-full ${severityColors[severity]}`} />
      <div className="flex-1">
        <p className="font-semibold text-slate-800">{message}</p>
        <p className="text-sm text-slate-500 mt-1">{impact}</p>
      </div>
      <button className="text-slate-400 hover:text-slate-600">
        <ArrowUpRight size={20} />
      </button>
    </div>
  );
};

const Calculator = (props: any) => <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>;

export default Dashboard;
