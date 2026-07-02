import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '../components/ProductCard';

const fetchProducts = async () => {
  // Le decimos que use la variable de Vercel en producción, o el localhost si estás programando en tu PC
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  
  const res = await fetch(`${baseUrl}/api/products`);
  if (!res.ok) throw new Error('Error al cargar');
  return res.json();
};

export const Mujer = () => {
  // Estados de UI
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  // Estados de Filtro y Ordenación
  const [sortOption, setSortOption] = useState('featured');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [availability, setAvailability] = useState({ inStock: false, outOfStock: false });

  // Traer datos
  const { data: allProducts = [], isLoading } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });

  // 1. Filtrar SOLO ropa de Mujer
  const womensProducts = allProducts.filter(p => p.category?.parent?.name === 'Mujer');

  // Extraer las categorías disponibles dinámicamente (Polos, Pantalones, etc.)
  const availableCategories = [...new Set(womensProducts.map(p => p.category.name))];

  // 2. Aplicar Filtros
  let displayedProducts = womensProducts.filter(p => {
    const price = Number(p.price);
    if (price < minPrice || price > maxPrice) return false;
    
    // Si hay categorías seleccionadas, filtramos por ellas
    if (selectedCategories.length > 0 && !selectedCategories.includes(p.category.name)) return false;

    const totalStock = p.variants?.reduce((acc, v) => acc + v.stock, 0) || 0;
    if (availability.inStock && !availability.outOfStock && totalStock === 0) return false;
    if (availability.outOfStock && !availability.inStock && totalStock > 0) return false;

    return true;
  });

  // 3. Aplicar Ordenación
  displayedProducts.sort((a, b) => {
    if (sortOption === 'price-asc') return Number(a.price) - Number(b.price);
    if (sortOption === 'price-desc') return Number(b.price) - Number(a.price);
    if (sortOption === 'a-z') return a.name.localeCompare(b.name);
    if (sortOption === 'z-a') return b.name.localeCompare(a.name);
    return 0; 
  });

  const handleClearFilters = () => {
    setMinPrice(0);
    setMaxPrice(500);
    setAvailability({ inStock: false, outOfStock: false });
  };

  const toggleCategory = (cat) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  // Prevenir scroll en móvil cuando el drawer de filtros está abierto
  useEffect(() => {
    if (isMobileFilterOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isMobileFilterOpen]);

  // COMPONENTE REUTILIZABLE: El contenido de los filtros (Precio y Disponibilidad)
  const FilterContent = () => (
    <div className="space-y-10">
      <div>
        <h3 className="text-sm uppercase tracking-widest font-medium mb-6">Precio</h3>
        <div className="flex items-center gap-2">
          <div className="flex-1 border border-gray-300 p-2">
            <label className="text-[10px] text-gray-500 uppercase block">Desde</label>
            <div className="flex items-center">
              <span className="text-gray-400 mr-1 text-sm">S/</span>
              <input type="number" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} className="w-full outline-none text-sm bg-transparent" />
            </div>
          </div>
          <span className="text-gray-400">-</span>
          <div className="flex-1 border border-gray-300 p-2">
            <label className="text-[10px] text-gray-500 uppercase block">Hasta</label>
            <div className="flex items-center">
              <span className="text-gray-400 mr-1 text-sm">S/</span>
              <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full outline-none text-sm bg-transparent" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm uppercase tracking-widest font-medium mb-6">Disponibilidad</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${availability.inStock ? 'bg-black border-black' : 'border-gray-400 group-hover:border-black'}`}>
              {availability.inStock && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
            </div>
            <span className="text-sm text-gray-700 uppercase tracking-wide">En Stock</span>
            <input type="checkbox" className="hidden" checked={availability.inStock} onChange={(e) => setAvailability({...availability, inStock: e.target.checked})} />
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${availability.outOfStock ? 'bg-black border-black' : 'border-gray-400 group-hover:border-black'}`}>
              {availability.outOfStock && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
            </div>
            <span className="text-sm text-gray-700 uppercase tracking-wide">Sin Stock</span>
            <input type="checkbox" className="hidden" checked={availability.outOfStock} onChange={(e) => setAvailability({...availability, outOfStock: e.target.checked})} />
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white pt-[72px] min-h-screen flex flex-col">
      
      {/* HERO BANNER */}
      <div 
        className="w-full h-[33vh] bg-cover bg-center flex items-center justify-center relative"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <h1 className="relative z-10 text-white text-5xl md:text-6xl font-light tracking-widest uppercase">Mujer</h1>
      </div>

      {/* ==========================================
          VERSIÓN MÓVIL: Controles Apilados
          ========================================== */}
      <div className="md:hidden px-4 py-6 border-b border-gray-100 flex flex-col gap-6">
        {/* Categorías */}
        <div>
          <h2 className="text-xs font-bold tracking-widest uppercase mb-4 text-gray-500">Categorías</h2>
          <div className="flex flex-wrap gap-2">
            {availableCategories.map(cat => (
              <button 
                key={cat} onClick={() => toggleCategory(cat)}
                className={`px-5 py-2 border rounded-full text-xs font-medium tracking-widest uppercase transition-colors ${selectedCategories.includes(cat) ? 'bg-black text-white border-black' : 'bg-transparent text-black border-gray-300'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        {/* Filtros Toggle */}
        <button 
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex justify-between items-center py-4 border-y border-gray-100 w-full"
        >
          <span className="text-sm font-medium tracking-widest uppercase">Filtros</span>
          <span className="text-xl font-light">+</span>
        </button>

        {/* Ordenar y Conteo */}
        <div className="flex justify-between items-center relative">
          <button onClick={() => setIsSortOpen(!isSortOpen)} className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest">
            Ordenar <span className="text-[10px]">{isSortOpen ? '▲' : '▼'}</span>
          </button>
          <span className="text-xs text-gray-400 font-medium tracking-widest uppercase">{displayedProducts.length} Productos</span>
          
          {isSortOpen && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 shadow-xl z-20 flex flex-col py-2">
              {[
                { id: 'featured', label: 'Destacados' },
                { id: 'a-z', label: 'Alfabéticamente, A-Z' },
                { id: 'z-a', label: 'Alfabéticamente, Z-A' },
                { id: 'price-asc', label: 'Precio, Menor a Mayor' },
                { id: 'price-desc', label: 'Precio, Mayor a Menor' }
              ].map(opt => (
                <button 
                  key={opt.id} onClick={() => { setSortOption(opt.id); setIsSortOpen(false); }}
                  className={`text-left px-4 py-3 text-sm border-b border-gray-50 last:border-0 ${sortOption === opt.id ? 'font-bold' : 'text-gray-600'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ==========================================
          VERSIÓN ESCRITORIO: Barra Superior (Categorías y Orden)
          ========================================== */}
      <div className="hidden md:flex justify-between items-end px-8 py-8 border-b border-gray-100 max-w-[1800px] mx-auto w-full">
        {/* Lado Izquierdo */}
        <div>
          <h2 className="text-xs font-bold tracking-widest uppercase mb-4 text-gray-500">Categorías</h2>
          <div className="flex gap-3">
            {availableCategories.map(cat => (
              <button 
                key={cat} onClick={() => toggleCategory(cat)}
                className={`px-6 py-2 border rounded-full text-xs font-medium tracking-widest uppercase transition-colors hover:border-black ${selectedCategories.includes(cat) ? 'bg-black text-white border-black' : 'bg-transparent text-black border-gray-300'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Lado Derecho */}
        <div className="flex items-center gap-6 relative">
          <span className="text-xs text-gray-400 font-medium tracking-widest uppercase">{displayedProducts.length} Productos</span>
          <button onClick={() => setIsSortOpen(!isSortOpen)} className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest hover:text-gray-500 transition-colors">
            Ordenar <span className="text-[10px]">{isSortOpen ? '▲' : '▼'}</span>
          </button>
          
          {isSortOpen && (
            <div className="absolute top-full right-0 mt-4 w-48 bg-white border border-gray-200 shadow-xl z-20 flex flex-col py-2">
              {[
                { id: 'featured', label: 'Destacados' },
                { id: 'a-z', label: 'A-Z' },
                { id: 'z-a', label: 'Z-A' },
                { id: 'price-asc', label: 'Precio Menor' },
                { id: 'price-desc', label: 'Precio Mayor' }
              ].map(opt => (
                <button 
                  key={opt.id} onClick={() => { setSortOption(opt.id); setIsSortOpen(false); }}
                  className={`text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortOption === opt.id ? 'font-bold' : 'text-gray-600'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ==========================================
          CONTENEDOR PRINCIPAL (Cuerpo de la página)
          ========================================== */}
      <div className="flex flex-1 max-w-[1800px] mx-auto w-full relative">
        
        {/* BARRA LATERAL FIJA (Solo PC) - 1/6 del ancho */}
        {/* sticky top-[72px] hace que se detenga justo debajo de la barra de navegación formando la "L" */}
        <div className="hidden md:block w-[20%] lg:w-[16.666%] sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto px-6 py-8 border-r border-gray-100">
          <FilterContent />
          <button onClick={handleClearFilters} className="mt-10 w-full py-3 border border-black text-black uppercase tracking-widest text-[10px] font-medium hover:bg-gray-50 transition-colors">
            Borrar Filtros
          </button>
        </div>

        {/* GRILLA DE PRODUCTOS - 5/6 del ancho */}
        <div className="max-w-[1800px] mx-auto px-4 md:px-8 pb-24">
        {isLoading ? (
          <div className="py-20 text-center tracking-widest uppercase">Cargando colección...</div>
        ) : displayedProducts.length === 0 ? (
          <div className="py-20 text-center tracking-widest text-gray-500 uppercase">No hay productos que coincidan.</div>
        ) : (
          // Grilla limpia apuntando al nuevo componente
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      </div>


      {/* ==========================================
          MENÚ LATERAL DE FILTROS MÓVIL (Drawer)
          ========================================== */}
      <div 
        className={`md:hidden fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${isMobileFilterOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsMobileFilterOpen(false)}
      ></div>

      <div className={`md:hidden fixed top-0 right-0 h-full w-[85%] bg-white z-50 shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col ${isMobileFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-lg font-medium tracking-widest uppercase">Filtro</h2>
          <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <FilterContent />
        </div>

        <div className="p-6 border-t border-gray-100 flex flex-col gap-3">
          <button onClick={handleClearFilters} className="w-full py-4 border border-black text-black uppercase tracking-widest text-sm font-medium">
            Borrar Todo
          </button>
          <button onClick={() => setIsMobileFilterOpen(false)} className="w-full py-4 bg-black text-white uppercase tracking-widest text-sm font-medium">
            Aplicar Filtros
          </button>
        </div>
      </div>

    </div>
  );
};