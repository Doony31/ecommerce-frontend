import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useEmblaCarousel from 'embla-carousel-react';
import { ProductCard } from '../components/ProductCard';

const fetchProducts = async () => {
  // Le decimos que use la variable de Vercel en producción, o el localhost si estás programando en tu PC
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  
  const res = await fetch(`${baseUrl}/api/products`);
  if (!res.ok) throw new Error('Error al cargar');
  return res.json();
};

// Datos para el carrusel horizontal
const SUBCATEGORIES = [
  { id: 1, name: 'Polos', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop', link: '/hombre' },
  { id: 2, name: 'Pantalones', img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1200&auto=format&fit=crop', link: '/hombre' },
  { id: 3, name: 'Abrigos', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200&auto=format&fit=crop', link: '/mujer' }, 
  { id: 4, name: 'Shorts', img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=1200&auto=format&fit=crop', link: '/mujer' }, 
  { id: 5, name: 'Accesorios', img: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1200&auto=format&fit=crop', link: '/mujer' }, 
];

export const Hombre = () => {
  const [emblaRef] = useEmblaCarousel({ dragFree: true, containScroll: 'trimSnaps' });
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const [sortOption, setSortOption] = useState('featured');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [availability, setAvailability] = useState({ inStock: false, outOfStock: false });

  const { data: allProducts = [], isLoading } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });

  const mensProducts = allProducts.filter(p => p.category?.parent?.name === 'Hombre');
  const availableTypes = [...new Set(mensProducts.map(p => p.category.name))];

  let displayedProducts = mensProducts.filter(p => {
    const price = Number(p.price);
    if (price < minPrice || price > maxPrice) return false;
    
    if (selectedTypes.length > 0 && !selectedTypes.includes(p.category.name)) return false;

    const totalStock = p.variants?.reduce((acc, v) => acc + v.stock, 0) || 0;
    if (availability.inStock && !availability.outOfStock && totalStock === 0) return false;
    if (availability.outOfStock && !availability.inStock && totalStock > 0) return false;

    return true;
  });

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
    setSelectedTypes([]);
    setAvailability({ inStock: false, outOfStock: false });
  };

  const toggleType = (type) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  useEffect(() => {
    if (isFilterOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isFilterOpen]);

  return (
    <div className="w-full bg-white pt-[72px]">
      
      {/* HERO BANNER */}
      <div 
        className="w-full h-[33vh] bg-cover bg-center flex items-center justify-center relative"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1600&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <h1 className="relative z-10 text-white text-5xl md:text-6xl font-light tracking-widest uppercase">Hombre</h1>
      </div>

      {/* CARRUSEL RECTANGULAR ESTILO REFERENCIA */}
      <div className="w-full py-8 md:py-12 px-4 md:px-8">
        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex gap-2 md:gap-4">
            {SUBCATEGORIES.map((cat) => (
              // flex-[0_0_85%] hace que ocupe casi toda la pantalla y se asome el siguiente
              // aspect-[4/3] o aspect-[16/9] lo hace un rectángulo horizontal
              <Link key={cat.id} to={cat.link} className="flex-[0_0_85%] md:flex-[0_0_60%] lg:flex-[0_0_45%] relative aspect-[4/3] md:aspect-[16/9] overflow-hidden group">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                
                {/* Textos en el medio, alineados a los extremos */}
                <div className="absolute top-1/2 -translate-y-1/2 w-full px-6 flex justify-between items-center text-white font-bold tracking-widest uppercase text-sm md:text-base">
                  <span>{cat.name}</span>
                  <span>Comprar</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* BARRA DE CONTROLES: Filtro y Ordenar */}
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-6 flex justify-between items-center border-t border-gray-200">
        <button onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest hover:text-gray-500 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
          Filtro
        </button>

        <div className="relative">
          <button onClick={() => setIsSortOpen(!isSortOpen)} className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest hover:text-gray-500 transition-colors">
            Ordenar <span className="text-xs">{isSortOpen ? '▲' : '▼'}</span>
          </button>
          
          {isSortOpen && (
            <div className="absolute top-full right-0 mt-4 w-48 bg-white border border-gray-200 shadow-xl z-20 flex flex-col py-2">
              {[
                { id: 'featured', label: 'Destacados' },
                { id: 'a-z', label: 'Alfabéticamente, A-Z' },
                { id: 'z-a', label: 'Alfabéticamente, Z-A' },
                { id: 'price-asc', label: 'Precio, Menor a Mayor' },
                { id: 'price-desc', label: 'Precio, Mayor a Menor' }
              ].map(opt => (
                <button 
                  key={opt.id} 
                  onClick={() => { setSortOption(opt.id); setIsSortOpen(false); }}
                  className={`text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortOption === opt.id ? 'font-bold' : 'text-gray-600'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* GRILLA DE PRODUCTOS */}
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

      {/* MENÚ LATERAL DE FILTROS */}
      <div 
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${isFilterOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsFilterOpen(false)}
      ></div>

      <div className={`fixed top-0 left-0 h-full w-[85%] md:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-lg font-medium tracking-widest uppercase">Filtro</h2>
          <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-10">
          
          <div>
            <h3 className="text-sm uppercase tracking-widest font-medium mb-6">Precio</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 border border-gray-300 p-3">
                <label className="text-[10px] text-gray-500 uppercase">Desde</label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1">S/</span>
                  <input type="number" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} className="w-full outline-none text-sm" />
                </div>
              </div>
              <span className="text-gray-400">-</span>
              <div className="flex-1 border border-gray-300 p-3">
                <label className="text-[10px] text-gray-500 uppercase">Hasta</label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1">S/</span>
                  <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full outline-none text-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* ARREGLO DEL FILTRO: TIPO DE PRODUCTO */}
          <div>
            <h3 className="text-sm uppercase tracking-widest font-medium mb-6">Tipo de Producto</h3>
            <div className="space-y-4">
              {availableTypes.map(type => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${selectedTypes.includes(type) ? 'bg-black border-black' : 'border-gray-400 group-hover:border-black'}`}>
                    {selectedTypes.includes(type) && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                  </div>
                  <span className="text-sm text-gray-700 uppercase tracking-wide">{type}</span>
                  {/* El input oculto es vital para que React detecte el cambio al hacer clic en el label */}
                  <input type="checkbox" className="hidden" checked={selectedTypes.includes(type)} onChange={() => toggleType(type)} />
                </label>
              ))}
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

        <div className="p-6 border-t border-gray-100 flex flex-col gap-3">
          <button onClick={handleClearFilters} className="w-full py-4 border border-black text-black uppercase tracking-widest text-sm font-medium hover:bg-gray-50 transition-colors">
            Borrar Todo
          </button>
          <button onClick={() => setIsFilterOpen(false)} className="w-full py-4 bg-black text-white uppercase tracking-widest text-sm font-medium hover:bg-gray-900 transition-colors">
            Aplicar Filtros
          </button>
        </div>

      </div>
    </div>
  );
};