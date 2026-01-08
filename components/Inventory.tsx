
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical,
  AlertCircle,
  BarChart2
} from 'lucide-react';

const mockProducts = [
  { id: '1', barcode: '78910001', name: 'Arroz Agulhinha 5kg', category: 'Grãos', stock: 120, min: 50, cost: 18.50, sale: 29.90 },
  { id: '2', barcode: '78910002', name: 'Feijão Carioca 1kg', category: 'Grãos', stock: 45, min: 60, cost: 4.20, sale: 8.50 },
  { id: '3', barcode: '78910003', name: 'Leite Integral 1L', category: 'Laticínios', stock: 200, min: 100, cost: 3.10, sale: 5.80 },
  { id: '4', barcode: '78910004', name: 'Óleo de Soja 900ml', category: 'Mercearia', stock: 85, min: 40, cost: 6.50, sale: 11.90 },
  { id: '5', barcode: '78910005', name: 'Detergente Líquido 500ml', category: 'Limpeza', stock: 12, min: 30, cost: 1.20, sale: 2.50 },
];

const Inventory: React.FC<{ role: string | undefined }> = ({ role }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Estoque</h1>
          <p className="text-slate-500">Controle de produtos, margens e alertas de reposição.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-slate-50 text-slate-700">
            <Download size={18} />
            Exportar CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md">
            <Plus size={18} />
            Novo Produto
          </button>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <PackageSearch size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total de Itens</p>
            <p className="text-xl font-bold">12.450</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Abaixo do Mínimo</p>
            <p className="text-xl font-bold">42</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <BarChart2 size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Valor Total em Estoque</p>
            <p className="text-xl font-bold">R$ 384.200</p>
          </div>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome, categoria ou código..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-slate-50 text-slate-600">
              <Filter size={18} />
              Filtros
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Produto</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estoque Atual</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Preço Custo</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Preço Venda</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Margem</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockProducts.map((p) => {
                const isLow = p.stock < p.min;
                const margin = (((p.sale - p.cost) / p.sale) * 100).toFixed(1);
                
                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.barcode}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm px-2 py-1 bg-slate-100 rounded text-slate-600">{p.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isLow ? 'text-red-600' : 'text-slate-800'}`}>{p.stock} un</span>
                        {isLow && <AlertCircle size={14} className="text-red-500" />}
                      </div>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1">
                        <div 
                          className={`h-full rounded-full ${isLow ? 'bg-red-500' : 'bg-emerald-500'}`} 
                          style={{ width: `${Math.min((p.stock/p.min) * 100, 100)}%` }} 
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">R$ {p.cost.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm font-bold">R$ {p.sale.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold ${Number(margin) > 40 ? 'text-emerald-600' : 'text-slate-600'}`}>
                        {margin}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t bg-slate-50 flex justify-between items-center text-sm text-slate-500">
           <span>Mostrando 5 de 12.450 produtos</span>
           <div className="flex gap-2">
              <button className="px-3 py-1 border rounded bg-white hover:bg-slate-50">Anterior</button>
              <button className="px-3 py-1 border rounded bg-white hover:bg-slate-50">Próximo</button>
           </div>
        </div>
      </div>
    </div>
  );
};

const PackageSearch = (props: any) => <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m7.5 4.27 9 5.15"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/><circle cx="18.5" cy="15.5" r="2.5"/><path d="M20.27 17.27 22 19"/></svg>;

export default Inventory;
