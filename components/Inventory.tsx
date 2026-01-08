
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical,
  AlertCircle,
  PackageSearch,
  BarChart2,
  X,
  Save,
  Loader2,
  FileDown,
  FileText
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ProductData {
  id?: string;
  barcode: string;
  name: string;
  category: string;
  stock_quantity: number;
  min_stock: number;
  cost_price: number;
  sale_price: number;
}

const Inventory: React.FC<{ role: string | undefined }> = ({ role }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [formData, setFormData] = useState<ProductData>({
    barcode: '',
    name: '',
    category: '',
    stock_quantity: 0,
    min_stock: 10,
    cost_price: 0,
    sale_price: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setProducts(data);
    } catch (error: any) {
      console.error('Erro detalhado ao buscar produtos:', error.message || error);
      // Fallback para mock se a tabela não existir
      setProducts([
        { id: '1', barcode: '78910001', name: 'Arroz Agulhinha 5kg', category: 'Grãos', stock_quantity: 120, min_stock: 50, cost_price: 1850.50, sale_price: 2990.90 },
        { id: '2', barcode: '78910002', name: 'Feijão Carioca 1kg', category: 'Grãos', stock_quantity: 45, min_stock: 60, cost_price: 420.20, sale_price: 850.50 },
        { id: '3', barcode: '78910003', name: 'Óleo Vegetal 900ml', category: 'Mercearia', stock_quantity: 12, min_stock: 30, cost_price: 650.00, sale_price: 1200.00 },
      ]);
    } finally {
      setFetching(false);
    }
  };

  const exportToCSV = () => {
    if (products.length === 0) {
      alert('Não há dados para exportar.');
      return;
    }
    const headers = ['Código de Barras', 'Nome', 'Categoria', 'Estoque', 'Estoque Mínimo', 'Custo (Kz)', 'Venda (Kz)', 'Margem (%)'];
    const rows = products.map(p => {
      const margin = p.sale_price > 0 ? (((p.sale_price - p.cost_price) / p.sale_price) * 100).toFixed(2) : '0';
      return [p.barcode, p.name, p.category, p.stock_quantity, p.min_stock, p.cost_price.toFixed(2), p.sale_price.toFixed(2), margin];
    });
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `inventario_gestorpro_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  const exportToPDF = () => {
    if (products.length === 0) {
      alert('Não há dados para exportar.');
      return;
    }

    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('pt-AO');
    const time = new Date().toLocaleTimeString('pt-AO');
    const totalCost = products.reduce((acc, p) => acc + (p.cost_price * p.stock_quantity), 0);
    const totalSale = products.reduce((acc, p) => acc + (p.sale_price * p.stock_quantity), 0);
    const potentialProfit = totalSale - totalCost;

    // Design Elements
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 40, 'F');
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('GESTORPRO RETAIL', 14, 25);
    
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.setFont('helvetica', 'normal');
    doc.text('SISTEMA INTEGRADO DE GESTÃO E BI', 14, 32);
    doc.text(`GERADO EM: ${date} ÀS ${time}`, 150, 25);

    // Summary Box
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 45, 182, 30, 3, 3, 'FD');
    
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('VALOR TOTAL (CUSTO)', 20, 55);
    doc.text('VALOR TOTAL (VENDA)', 80, 55);
    doc.text('LUCRO POTENCIAL', 145, 55);

    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(`Kz ${totalCost.toLocaleString('pt-AO')}`, 20, 65);
    doc.text(`Kz ${totalSale.toLocaleString('pt-AO')}`, 80, 65);
    doc.setTextColor(16, 185, 129); // emerald-500
    doc.text(`Kz ${potentialProfit.toLocaleString('pt-AO')}`, 145, 65);

    // Table
    const tableHeaders = [['Código', 'Produto', 'Categoria', 'Estoque', 'Custo Unit.', 'Venda Unit.', 'Margem']];
    const tableData = products.map(p => [
      p.barcode,
      p.name,
      p.category,
      `${p.stock_quantity} un`,
      `Kz ${p.cost_price.toLocaleString('pt-AO', { minimumFractionDigits: 0 })}`,
      `Kz ${p.sale_price.toLocaleString('pt-AO', { minimumFractionDigits: 0 })}`,
      `${p.sale_price > 0 ? (((p.sale_price - p.cost_price) / p.sale_price) * 100).toFixed(0) : 0}%`
    ]);

    autoTable(doc, {
      startY: 85,
      head: tableHeaders,
      body: tableData,
      theme: 'grid',
      headStyles: { 
        fillColor: [15, 23, 42], 
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center'
      },
      styles: { 
        fontSize: 8, 
        cellPadding: 4,
        lineColor: [226, 232, 240],
        lineWidth: 0.1
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 'auto' },
        3: { halign: 'center' },
        4: { halign: 'right' },
        5: { halign: 'right' },
        6: { halign: 'center' }
      },
      alternateRowStyles: { fillColor: [252, 253, 255] },
      didDrawPage: (data) => {
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        const pageNumber = doc.internal.getNumberOfPages();
        doc.text(`Relatório de Inventário GestorPro - Página ${pageNumber}`, 14, 285);
      }
    });

    doc.save(`relatorio_estoque_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('products').insert([formData]);
      if (error) throw error;
      alert('Produto cadastrado com sucesso!');
      setIsModalOpen(false);
      setFormData({ barcode: '', name: '', category: '', stock_quantity: 0, min_stock: 10, cost_price: 0, sale_price: 0 });
      fetchProducts();
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error.message || error);
      alert('Erro ao salvar produto: ' + (error.message || 'Verifique sua conexão com o banco de dados.'));
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.barcode.includes(searchTerm) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Estoque</h1>
          <p className="text-slate-500">Controle de produtos, margens e alertas de reposição em tempo real.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-slate-50 text-slate-700 bg-white shadow-sm active:scale-95 transition-all"
            title="Exportar para Excel/CSV"
          >
            <FileText size={18} />
            <span className="hidden sm:inline">CSV</span>
          </button>
          <button 
            onClick={exportToPDF}
            className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-slate-50 text-slate-700 bg-white shadow-sm active:scale-95 transition-all"
            title="Gerar PDF Profissional"
          >
            <FileDown size={18} className="text-red-500" />
            <span className="hidden sm:inline">Relatório PDF</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Plus size={18} />
            Novo Produto
          </button>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <PackageSearch size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">SKUs Ativos</p>
            <p className="text-xl font-bold">{products.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Reposição Urgente</p>
            <p className="text-xl font-bold">{products.filter(p => p.stock_quantity < p.min_stock).length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <BarChart2 size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Patrimônio em Estoque</p>
            <p className="text-xl font-bold">Kz {products.reduce((acc, p) => acc + (p.sale_price * p.stock_quantity), 0).toLocaleString('pt-AO')}</p>
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
          <button className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-slate-50 text-slate-600 bg-white">
            <Filter size={18} />
            Filtros Avançados
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Produto</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Disponibilidade</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Custo</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Venda</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Margem</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {fetching ? (
                <tr>
                   <td colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <Loader2 className="animate-spin text-blue-600" size={40} />
                        <span className="font-medium">Sincronizando com inventário...</span>
                      </div>
                   </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                   <td colSpan={7} className="py-20 text-center text-slate-400 font-medium">
                      Nenhum produto corresponde aos critérios de busca.
                   </td>
                </tr>
              ) : filteredProducts.map((p) => {
                const isLow = p.stock_quantity < p.min_stock;
                const margin = p.sale_price > 0 ? (((p.sale_price - p.cost_price) / p.sale_price) * 100).toFixed(1) : '0';
                
                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-500 font-mono tracking-tight">{p.barcode}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded-md text-slate-600 uppercase">{p.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${isLow ? 'text-red-600' : 'text-slate-800'}`}>{p.stock_quantity} un</span>
                          {isLow && <AlertCircle size={14} className="text-red-500" />}
                        </div>
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full mt-1.5">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${isLow ? 'bg-red-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${Math.min((p.stock_quantity/Math.max(p.min_stock, 1)) * 50, 100)}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">Kz {p.cost_price.toLocaleString('pt-AO')}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">Kz {p.sale_price.toLocaleString('pt-AO')}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${Number(margin) > 30 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-600'}`}>
                        {margin}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-full transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Cadastro */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/30">
                  <PackageSearch size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Novo SKU</h3>
                  <p className="text-slate-400 text-sm">Registre um novo produto no inventário.</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Código EAN/GTIN</label>
                  <input 
                    required
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all"
                    placeholder="789..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Categoria</label>
                  <input 
                    required
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all"
                    placeholder="Ex: Bebidas"
                  />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Descrição Comercial</label>
                  <input 
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all"
                    placeholder="Ex: Coca-Cola Lata 350ml"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Custo de Aquisição (Kz)</label>
                  <input 
                    required
                    type="number"
                    step="0.01"
                    value={formData.cost_price}
                    onChange={(e) => setFormData({...formData, cost_price: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all"
                    placeholder="0,00"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Preço de Prateleira (Kz)</label>
                  <input 
                    required
                    type="number"
                    step="0.01"
                    value={formData.sale_price}
                    onChange={(e) => setFormData({...formData, sale_price: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-blue-600"
                    placeholder="0,00"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Estoque Físico Atual</label>
                  <input 
                    required
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({...formData, stock_quantity: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Estoque Crítico (Aviso)</label>
                  <input 
                    required
                    type="number"
                    value={formData.min_stock}
                    onChange={(e) => setFormData({...formData, min_stock: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all active:scale-95"
                >
                  Descartar
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  Confirmar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
