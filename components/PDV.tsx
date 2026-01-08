
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  CheckCircle2, 
  X,
  CreditCard,
  Banknote,
  Loader2,
  PackageX
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Product {
  id: string;
  barcode: string;
  name: string;
  sale_price: number;
  stock_quantity: number;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

const PDV: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [saleResult, setSaleResult] = useState<{items: CartItem[], total: number} | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .gt('stock_quantity', 0)
        .order('name', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      // Fallback mocks
      setProducts([
        { id: '1', barcode: '7891', name: 'Arroz 1kg', sale_price: 1200, stock_quantity: 50, category: 'Grãos' },
        { id: '2', barcode: '7892', name: 'Feijão 1kg', sale_price: 850, stock_quantity: 30, category: 'Grãos' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock_quantity) {
        alert('Estoque insuficiente para este item!');
        return;
      }
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        if (newQty > item.stock_quantity) {
          alert('Quantidade excede o estoque!');
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((acc, item) => acc + (item.sale_price * item.quantity), 0);

  const handleFinishSale = async () => {
    if (cart.length === 0) return;
    
    setIsProcessing(true);
    try {
      // Em uma transação real, atualizaríamos cada produto.
      // Para o exemplo, vamos atualizar um a um no Supabase
      for (const item of cart) {
        const { error } = await supabase
          .from('products')
          .update({ stock_quantity: item.stock_quantity - item.quantity })
          .eq('id', item.id);
        
        if (error) throw error;
      }

      setSaleResult({ items: [...cart], total });
      setCart([]);
      fetchProducts(); // Recarrega o estoque atualizado
    } catch (error: any) {
      alert('Erro ao processar venda: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.barcode.includes(searchTerm)
  );

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Terminal de Vendas (Saída)</h1>
          <p className="text-slate-500">Realize vendas e dê baixa automática no estoque.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
        {/* Catálogo de Produtos */}
        <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Pesquisar produto por nome ou código..." 
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm focus:border-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
                <Loader2 className="animate-spin mb-2" size={32} />
                <span>Buscando produtos no estoque...</span>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
                <PackageX size={48} className="mb-4 opacity-20" />
                <span className="font-medium">Nenhum produto disponível no estoque.</span>
              </div>
            ) : filteredProducts.map(p => (
              <button 
                key={p.id}
                onClick={() => addToCart(p)}
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all text-left flex flex-col justify-between group active:scale-95"
              >
                <div>
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{p.category}</span>
                  <h3 className="font-bold text-slate-800 line-clamp-1">{p.name}</h3>
                  <p className="text-xs text-slate-400">Cod: {p.barcode}</p>
                </div>
                <div className="mt-4 flex justify-between items-end">
                  <p className="text-lg font-black text-slate-900">Kz {p.sale_price.toLocaleString('pt-AO')}</p>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${p.stock_quantity < 10 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500'}`}>
                    Qtd: {p.stock_quantity}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Carrinho de Compras */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col overflow-hidden h-full max-h-[calc(100vh-200px)]">
          <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart size={24} />
              <h3 className="text-lg font-bold">Carrinho</h3>
            </div>
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold">{cart.length} itens</span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 divide-y space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                <ShoppingCart size={48} className="mb-4 opacity-10" />
                <p className="text-sm">O carrinho está vazio.<br/>Selecione produtos ao lado.</p>
              </div>
            ) : cart.map(item => (
              <div key={item.id} className="pt-4 flex items-center gap-4 group">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate">{item.name}</p>
                  <p className="text-xs text-blue-600 font-bold">Kz {item.sale_price.toLocaleString('pt-AO')}</p>
                </div>
                <div className="flex items-center bg-slate-100 rounded-lg p-1">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded-md transition-colors"><Minus size={14}/></button>
                  <span className="w-8 text-center font-bold text-xs">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded-md transition-colors"><Plus size={14}/></button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="p-6 bg-slate-50 border-t space-y-4">
            <div className="flex justify-between items-center text-slate-500 font-medium">
              <span>Subtotal</span>
              <span>Kz {total.toLocaleString('pt-AO')}</span>
            </div>
            <div className="flex justify-between items-center text-xl font-black text-slate-900">
              <span>TOTAL</span>
              <span className="text-blue-600">Kz {total.toLocaleString('pt-AO')}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <button 
                className="flex items-center justify-center gap-2 py-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-all text-sm active:scale-95"
                onClick={() => setCart([])}
              >
                Limpar
              </button>
              <button 
                disabled={cart.length === 0 || isProcessing}
                onClick={handleFinishSale}
                className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all text-sm disabled:opacity-50 active:scale-95"
              >
                {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                Vender
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pop-up de Venda Concluída */}
      {saleResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="bg-emerald-500 p-8 flex flex-col items-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-2xl font-black">Venda Realizada!</h3>
              <p className="text-emerald-100 font-medium">Estoque atualizado com sucesso.</p>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resumo do Pedido</p>
                <div className="max-h-40 overflow-y-auto divide-y">
                  {saleResult.items.map(item => (
                    <div key={item.id} className="py-2 flex justify-between text-sm">
                      <span className="text-slate-600">{item.quantity}x {item.name}</span>
                      <span className="font-bold text-slate-800">Kz {(item.sale_price * item.quantity).toLocaleString('pt-AO')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t-2 border-dashed flex justify-between items-center">
                <span className="font-bold text-slate-500">Valor Pago</span>
                <span className="text-3xl font-black text-slate-900">Kz {saleResult.total.toLocaleString('pt-AO')}</span>
              </div>

              <button 
                onClick={() => setSaleResult(null)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all active:scale-95"
              >
                Nova Venda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDV;
