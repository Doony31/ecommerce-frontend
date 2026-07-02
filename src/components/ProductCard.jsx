import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

export const ProductCard = ({ product }) => {
  const [isSizeMenuOpen, setIsSizeMenuOpen] = useState(false);
  const { addToCart } = useCartStore();

  const totalStock = product.variants?.reduce((acc, v) => acc + v.stock, 0) || 0;
  const isOutOfStock = totalStock === 0;

  // Anulamos cualquier evento extra para asegurar el clic
  const openMenu = (e) => {
    e.preventDefault();
    setIsSizeMenuOpen(true);
  };

  const closeMenu = (e) => {
    e.preventDefault();
    setIsSizeMenuOpen(false);
  };

  const handleSelectSize = (e, size) => {
    e.preventDefault();
    addToCart(product, size); 
    setIsSizeMenuOpen(false);
  };

  return (
    <div className="group relative">
      
      {isOutOfStock && (
        <div className="absolute top-3 right-3 z-20 bg-gray-900 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1">
          Sin Stock
        </div>
      )}

      <div className={`relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4 ${isOutOfStock ? 'grayscale opacity-80' : ''}`}>
        
        {/* 1. ENLACE DE LA IMAGEN (Totalmente separado del botón) */}
        <Link to={`/producto/${product.id}`} className="absolute inset-0 z-0">
          <img src={product.images[0]} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-0" />
          {product.images[1] && (
             <img src={product.images[1]} alt={`${product.name} vista alternativa`} className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100" />
          )}
        </Link>

        {/* 2. BOTÓN + (z-20 para que flote encima de la imagen) */}
        {!isOutOfStock && (
          <button 
            onClick={openMenu}
            className={`absolute bottom-4 right-4 w-10 h-10 bg-white text-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 z-20 shadow-md ${isSizeMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <span className="text-2xl font-light leading-none mb-1">+</span>
          </button>
        )}

        {/* 3. MENÚ DE TALLAS SUPERPUESTO (pointer-events controla si es clickeable o no) */}
        <div 
          className={`absolute inset-0 bg-white/95 backdrop-blur-sm z-30 p-6 flex flex-col justify-center transition-all duration-300 ease-in-out ${
            isSizeMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <button onClick={closeMenu} className="absolute top-4 right-4 text-gray-400 hover:text-black">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-6 text-center font-medium">Seleccionar Talla</p>
          
          <div className="grid grid-cols-3 gap-2">
            {product.variants?.map((variant) => {
              const noStock = variant.stock === 0;
              return (
                <button
                  key={variant.size}
                  disabled={noStock}
                  onClick={(e) => handleSelectSize(e, variant.size)}
                  className={`relative h-12 border flex items-center justify-center text-sm font-medium transition-all
                    ${noStock ? 'text-gray-300 border-gray-100 cursor-not-allowed' : 'text-black hover:border-black border-gray-300 hover:bg-gray-50'}
                  `}
                >
                  {variant.size}
                  {noStock && <span className="absolute w-[80%] h-[1px] bg-gray-200 rotate-45"></span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide truncate group-hover:underline">
          <Link to={`/producto/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="text-sm text-gray-600 mt-1">S/ {Number(product.price).toFixed(2)}</p>
      </div>
    </div>
  );
};