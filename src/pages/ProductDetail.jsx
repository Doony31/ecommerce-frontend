import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useEmblaCarousel from 'embla-carousel-react';
import { BestSellers } from '../components/BestSellers';
import { useCartStore } from '../store/cartStore';

const fetchProducts = async () => {
  // Le decimos que use la variable de Vercel en producción, o el localhost si estás programando en tu PC
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  
  const res = await fetch(`${baseUrl}/api/products`);
  if (!res.ok) throw new Error('Error al cargar');
  return res.json();
};

export const ProductDetail = () => {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState(null);
  const [isDescOpen, setIsDescOpen] = useState(false);
  const [showMobileStickyBtn, setShowMobileStickyBtn] = useState(true);
  const inlineButtonRef = useRef(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });


const { addToCart } = useCartStore();

  const product = products.find((p) => p.id === id);
  
  // SOLUCIÓN 2: Filtro inteligente. Toma el nombre (ej. "Polo Oversized Fit Negro"), le quita la última palabra (el color) y busca coincidencias exactas.
  const getBaseName = (name) => name.split(' ').slice(0, -1).join(' ');
  const baseName = product ? getBaseName(product.name) : '';
  const relatedColors = product ? products.filter(p => getBaseName(p.name) === baseName) : [];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowMobileStickyBtn(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (inlineButtonRef.current) observer.observe(inlineButtonRef.current);
    return () => observer.disconnect();
  }, [isLoading]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center pt-24">Cargando producto...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center pt-24 text-red-500">Producto no encontrado.</div>;

  // SOLUCIÓN 1: Separamos las imágenes. La galería es todo MENOS la última foto. El ícono es la ÚLTIMA foto.
  const gallery = product.images.slice(0, -1);

  return (
    <div className="w-full bg-white pt-[80px]">
      <div className="flex flex-col md:flex-row w-full max-w-[1800px] mx-auto">
        
        {/* GALERÍA */}
        <div className="w-full md:w-[60%] lg:w-[65%]">
          <div className="hidden md:grid grid-cols-2 gap-1 p-1">
            {gallery.map((img, index) => {
              let spanClass = "col-span-2";
              if (index === 1 || index === 2) spanClass = "col-span-1";
              return (
                <div key={index} className={`${spanClass} w-full`}>
                  <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-auto object-contain bg-gray-50" />
                </div>
              );
            })}
          </div>

          <div className="md:hidden relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {gallery.map((img, index) => (
                  <div key={index} className="flex-[0_0_100%] min-w-0">
                    <img src={img} alt={`Vista ${index + 1}`} className="w-full h-auto object-contain bg-gray-50" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-4 absolute bottom-4 w-full">
              {gallery.map((_, index) => (
                <div key={index} className={`w-2 h-2 rounded-full transition-colors duration-300 ${index === selectedIndex ? 'bg-black' : 'bg-gray-300'}`} />
              ))}
            </div>
          </div>
        </div>

        {/* INFORMACIÓN */}
        <div className="w-full md:w-[40%] lg:w-[35%] px-4 md:px-12 py-8 md:py-12">
          <div className="md:sticky md:top-24">
            <h1 className="text-2xl md:text-3xl font-medium uppercase tracking-wide mb-2">{product.name}</h1>
            <p className="text-lg text-gray-700 mb-8">S/ {Number(product.price).toFixed(2)}</p>

            {/* COLORES */}
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Color</p>
              <div className="flex gap-3">
                {relatedColors.map((colorProduct) => (
                  <Link 
                    key={colorProduct.id} 
                    to={`/producto/${colorProduct.id}`}
                    className={`w-12 h-16 border-2 overflow-hidden transition-all hover:border-black ${colorProduct.id === product.id ? 'border-black' : 'border-transparent'}`}
                  >
                    {/* Leemos el ícono de la última posición del producto relacionado */}
                    <img src={colorProduct.images[colorProduct.images.length - 1]} alt="color icon" className="w-full h-full object-cover" />
                  </Link>
                ))}
              </div>
            </div>

            {/* TALLAS */}
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Talla</p>
              <div className="flex flex-wrap gap-2">
                {product.variants?.map((variant) => {
                  const isOutOfStock = variant.stock === 0;
                  const isSelected = selectedSize === variant.size;
                  return (
                    <button
                      key={variant.size}
                      disabled={isOutOfStock}
                      onClick={() => setSelectedSize(variant.size)}
                      className={`relative w-14 h-14 border flex items-center justify-center text-sm font-medium transition-all ${isOutOfStock ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-black hover:border-black border-gray-300'} ${isSelected && !isOutOfStock ? 'border-black border-2' : ''}`}
                    >
                      {variant.size}
                      {isOutOfStock && <span className="absolute w-[120%] h-[1px] bg-gray-300 rotate-45"></span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BOTÓN AÑADIR */}
            {/* Reemplaza el botón existente por este */}
            <button 
              ref={inlineButtonRef}
              disabled={!selectedSize}
              onClick={() => {
                // Al hacer clic, enviamos el producto completo y la talla seleccionada
                addToCart(product, selectedSize); 
                // Opcional: limpiar la talla para evitar doble clic accidental
                setSelectedSize(null);
              }}
              className={`w-full py-4 uppercase tracking-widest font-medium transition-colors duration-300 mb-10 ${!selectedSize ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}
            >
              {!selectedSize ? 'Selecciona una talla' : 'Añadir a la cesta'}
            </button>

            {/* ACORDEÓN DESCRIPCIÓN */}
            <div className="border-t border-gray-200">
              <button onClick={() => setIsDescOpen(!isDescOpen)} className="w-full flex justify-between items-center py-6 group">
                <span className="uppercase tracking-widest text-sm font-medium">Descripción</span>
                <span className="text-2xl font-light leading-none group-hover:text-gray-500 transition-colors">{isDescOpen ? '−' : '+'}</span>
              </button>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isDescOpen ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
                <p className="text-sm font-light text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            </div>
            <div className="border-b border-gray-200"></div>

          </div>
        </div>
      </div>

      <div className="mt-20 border-t border-gray-100 pt-10">
        <div className="text-center mb-[-40px]">
           <h2 className="text-2xl font-light tracking-widest uppercase">Puede que también te guste</h2>
        </div>
        <BestSellers />
      </div>

      <div className={`md:hidden fixed bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 z-40 transition-transform duration-300 ease-in-out ${showMobileStickyBtn ? 'translate-y-0' : 'translate-y-full'}`}>
        <button disabled={!selectedSize} className={`w-full py-4 uppercase tracking-widest font-medium transition-colors ${!selectedSize ? 'bg-gray-200 text-gray-400' : 'bg-black text-white'}`}>
          {selectedSize ? `Añadir - S/ ${Number(product.price).toFixed(2)}` : 'Añadir a la cesta'}
        </button>
      </div>
    </div>
  );
};