import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from './ProductCard'; // ¡NUEVO: Importamos el componente que arreglamos!

const fetchProducts = async () => {
  // Le decimos que use la variable de Vercel en producción, o el localhost si estás programando en tu PC
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  
  const res = await fetch(`${baseUrl}/api/products`);
  if (!res.ok) throw new Error('Error al cargar');
  return res.json();
};

export const BestSellers = () => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', dragFree: true, containScroll: 'trimSnaps' });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const filteredProducts = activeFilter === 'ALL' 
    ? products 
    : products.filter(p => p.category?.name.toUpperCase() === activeFilter);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  if (isLoading) return <div className="py-20 text-center tracking-widest">CARGANDO COLECCIÓN...</div>;
  if (isError) return <div className="py-20 text-center text-red-500">Ocurrió un error al cargar los productos.</div>;

  return (
    <section className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto overflow-hidden">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <h2 className="text-3xl font-light tracking-widest uppercase">Best Sellers</h2>
        
        <div className="flex items-center gap-6">
          <Link to="/productos" className="text-sm font-medium tracking-widest uppercase relative group pb-1">
            View all products
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black transition-all duration-300 group-hover:w-6 group-hover:left-1/2 group-hover:-translate-x-1/2"></span>
          </Link>

          <div className="flex gap-4">
            <button onClick={scrollPrev} disabled={prevBtnDisabled} className={`transition-colors duration-300 ${prevBtnDisabled ? 'text-gray-300' : 'text-black hover:text-gray-400'}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button onClick={scrollNext} disabled={nextBtnDisabled} className={`transition-colors duration-300 ${nextBtnDisabled ? 'text-gray-300' : 'text-black hover:text-gray-400'}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-10">
        {['ALL', 'POLOS', 'PANTALONES'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2 rounded-full border border-black text-sm tracking-widest transition-all duration-300
              ${activeFilter === filter ? 'bg-black text-white' : 'bg-transparent text-black hover:bg-gray-100'}
            `}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
        <div className="flex gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_25%] min-w-0">
              {/* ¡AQUÍ ESTÁ LA MAGIA! En lugar del botón roto, usamos nuestra ProductCard */}
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};