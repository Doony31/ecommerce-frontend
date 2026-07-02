import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '../store/cartStore'; // 1. Importamos la tienda

const fetchProducts = async () => {
  // Le decimos que use la variable de Vercel en producción, o el localhost si estás programando en tu PC
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  
  const res = await fetch(`${baseUrl}/api/products`);
  if (!res.ok) throw new Error('Error al cargar');
  return res.json();
};

const MENU_DATA = {
  hombre: {
    toda: ['Polos', 'Pantalones', 'Abrigos', 'Shorts'],
    accesorios: ['Gorros', 'Guantes']
  },
  mujer: {
    toda: ['Polos', 'Pantalones', 'Abrigos', 'Faldas'],
    accesorios: ['Bolsos', 'Cinturones']
  }
};

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/'; 

  const { cart, isCartOpen, toggleCart, toastItem, getTotalItems, getTotalPrice } = useCartStore();
  const actualTotalItems = getTotalItems();

  const [displayCount, setDisplayCount] = useState(actualTotalItems);

  useEffect(() => {
    if (!toastItem) {
      setDisplayCount(actualTotalItems);
    }
  }, [toastItem, actualTotalItems]);

  const [desktopHover, setDesktopHover] = useState(null); 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileLevel, setMobileLevel] = useState(1); 
  const [mobileCat, setMobileCat] = useState('hombre'); 
  const [mobileSub, setMobileSub] = useState('toda');   

  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });
  const promoProducts = products.slice(0, 2);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Al cambiar de página (ej. al darle clic a "Hombre"), cerramos todos los menús
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileLevel(1);
    setDesktopHover(null);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [mobileMenuOpen]);

  const isSolid = isScrolled || !isHome || desktopHover || mobileMenuOpen;
  const linkHoverEffect = "relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-current after:transition-all after:duration-300";

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
          isSolid ? 'bg-white text-black border-b border-gray-200' : 'bg-transparent text-white'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 h-[72px] flex justify-between items-center">
          
          <div className="flex-1 flex items-center h-full">
            
            <button 
              className="lg:hidden p-2 -ml-2 transition-colors"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                if (!mobileMenuOpen) setMobileLevel(1); 
              }}
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              )}
            </button>

            <div 
              className="hidden lg:flex items-center space-x-8 h-full font-medium tracking-wide text-sm uppercase"
              onMouseLeave={() => setDesktopHover(null)}
            >
              {/* CAMBIO: Botones reemplazados por <Link> y la línea amarrada al estado desktopHover */}
              <Link 
                to="/hombre"
                className="h-full flex items-center"
                onMouseEnter={() => setDesktopHover('hombre')}
              >
                <span className="relative pb-1">
                  Hombre
                  <span className={`absolute bottom-0 left-0 h-[1.5px] bg-current transition-all duration-300 ${desktopHover === 'hombre' ? 'w-full' : 'w-0'}`}></span>
                </span>
              </Link>

              <Link 
                to="/mujer"
                className="h-full flex items-center"
                onMouseEnter={() => setDesktopHover('mujer')}
              >
                <span className="relative pb-1">
                  Mujer
                  <span className={`absolute bottom-0 left-0 h-[1.5px] bg-current transition-all duration-300 ${desktopHover === 'mujer' ? 'w-full' : 'w-0'}`}></span>
                </span>
              </Link>

              <div 
                className={`fixed top-[72px] left-0 w-full bg-white text-black border-b border-gray-200 shadow-xl transition-all duration-300 ease-in-out ${
                  desktopHover ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                }`}
              >
                {desktopHover && (
                  <div className="container mx-auto px-6 py-12 flex gap-12">
                    <div className="w-1/5">
                      <h3 className="font-semibold mb-6 tracking-widest text-sm uppercase">Toda la ropa</h3>
                      <ul className="space-y-4">
                        {MENU_DATA[desktopHover].toda.map(item => (
                          <li key={item}><Link to={`/${desktopHover}`} className={`text-gray-600 hover:text-black ${linkHoverEffect}`}>{item}</Link></li>
                        ))}
                      </ul>
                    </div>
                    <div className="w-1/5">
                      <h3 className="font-semibold mb-6 tracking-widest text-sm uppercase">Accesorios</h3>
                      <ul className="space-y-4">
                        {MENU_DATA[desktopHover].accesorios.map(item => (
                          <li key={item}><Link to={`/${desktopHover}`} className={`text-gray-600 hover:text-black ${linkHoverEffect}`}>{item}</Link></li>
                        ))}
                      </ul>
                    </div>
                    <div className="w-3/5 flex gap-6 justify-end">
                      {promoProducts.map(p => (
                        <Link key={p.id} to={`/producto/${p.id}`} className="group relative w-64 aspect-[3/4] overflow-hidden bg-gray-100 cursor-pointer">
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          <p className="absolute bottom-4 left-4 text-white font-medium tracking-widest uppercase text-sm">Nuestra nueva colección</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <Link to="/" className="text-2xl font-bold tracking-widest">
              LOGO.
            </Link>
          </div>

<div className="flex-1 flex justify-end items-center space-x-6">
            <button className="hover:opacity-60 transition-opacity">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
            
            {/* CONTENEDOR DEL CARRITO */}
            <div className="relative">
              <button onClick={toggleCart} className="hover:opacity-60 transition-opacity relative block">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                {/* Número dinámico */}
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-[10px] text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {displayCount}
                </span>
              </button>

              {/* ==========================================
                  NOTIFICACIÓN FLOTANTE (TOAST) - VERSIÓN GRANDE
                  ========================================== */}
              <div 
                className={`fixed md:absolute top-[72px] md:top-full right-0 md:right-0 w-full md:w-[400px] lg:w-[480px] bg-white border border-gray-200 shadow-2xl p-6 transition-all duration-500 z-50 origin-top
                  ${toastItem ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-0 invisible'}
                `}
              >
                {toastItem && (
                  <div className="flex gap-6">
                    {/* Imagen grande w-32 (128px) */}
                    <img 
                      src={toastItem.images[0]} 
                      alt={toastItem.name} 
                      className="w-32 h-40 object-cover bg-gray-100" 
                    />
                    <div className="flex-1 text-black flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                           <h4 className="text-sm font-bold uppercase tracking-widest leading-tight">{toastItem.name}</h4>
                           <svg className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        
                        <p className="text-gray-600 text-xs tracking-wide uppercase mb-4">Añadido correctamente a la cesta</p>
                        
                        <div className="space-y-1.5 text-sm">
                          <p className="text-gray-500 uppercase text-[11px]">Talla: <span className="text-black font-medium text-sm">{toastItem.size}</span></p>
                          <p className="text-gray-500 uppercase text-[11px]">Cantidad: <span className="text-black font-medium text-sm">{toastItem.quantity}</span></p>
                        </div>
                      </div>
                      
                      <p className="text-lg font-bold">S/ {Number(toastItem.price).toFixed(2)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* MINI-CARRITO DESPLEGABLE */}
              {isCartOpen && cart.length > 0 && !toastItem && (
                <div className="absolute top-full right-0 mt-4 w-80 md:w-96 bg-white border border-gray-200 shadow-2xl flex flex-col z-40">
                  <div className="max-h-[320px] overflow-y-auto p-4 flex flex-col gap-4">
                    {cart.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <img src={item.images[0]} alt={item.name} className="w-20 h-24 object-cover bg-gray-100" />
                        <div className="flex-1 text-black flex flex-col justify-between">
                          <div>
                            <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest leading-tight">{item.name}</h4>
                            <p className="text-[10px] text-gray-500 uppercase mt-1">Talla: {item.size}</p>
                            <p className="text-[10px] text-gray-500 uppercase">Cant: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium">S/ {(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-4 text-black">
                      <span className="text-sm uppercase tracking-widest font-medium">Total</span>
                      <span className="text-lg font-bold">S/ {getTotalPrice().toFixed(2)}</span>
                    </div>
                    <Link to="/carrito" onClick={toggleCart} className="block w-full py-3 bg-black text-white text-center text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors">
                      Ver Carrito
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </nav>

      {/* ==========================================================
          MENÚ MÓVIL DESLIZANTE (FULL SCREEN)
          ========================================================== */}
      <div 
        className={`lg:hidden fixed inset-0 top-[72px] bg-white z-40 overflow-hidden transition-all duration-300 ease-in-out origin-top ${
          mobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
        }`}
      >
        <div 
          className="flex w-[300%] h-full transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${(mobileLevel - 1) * 33.333}%)` }}
        >
          
          <div className="w-1/3 h-full px-6 py-8 flex flex-col uppercase tracking-widest text-lg font-medium space-y-6">
            <button 
              onClick={() => { setMobileCat('hombre'); setMobileLevel(2); }} 
              className="flex justify-between items-center w-full pb-4 border-b border-gray-100"
            >
              <span className={linkHoverEffect}>Hombre</span>
              <span className="text-gray-400">&gt;</span>
            </button>
            <button 
              onClick={() => { setMobileCat('mujer'); setMobileLevel(2); }} 
              className="flex justify-between items-center w-full pb-4 border-b border-gray-100"
            >
              <span className={linkHoverEffect}>Mujer</span>
              <span className="text-gray-400">&gt;</span>
            </button>
            <Link to="/contacto" className={`block w-max pb-4 border-b border-gray-100 ${linkHoverEffect}`}>
              Contacto
            </Link>
          </div>

          <div className="w-1/3 h-full px-6 py-8 flex flex-col uppercase tracking-widest text-lg font-medium overflow-y-auto pb-32">
            <button onClick={() => setMobileLevel(1)} className="flex items-center text-gray-500 mb-8 w-max">
              <span className="mr-4">&lt;</span> {mobileCat}
            </button>

            <div className="space-y-6 mb-12">
              <button 
                onClick={() => { setMobileSub('toda'); setMobileLevel(3); }} 
                className="flex justify-between items-center w-full pb-4 border-b border-gray-100"
              >
                <span className={linkHoverEffect}>Toda la ropa</span>
                <span className="text-gray-400">&gt;</span>
              </button>
              <button 
                onClick={() => { setMobileSub('accesorios'); setMobileLevel(3); }} 
                className="flex justify-between items-center w-full pb-4 border-b border-gray-100"
              >
                <span className={linkHoverEffect}>Accesorios</span>
                <span className="text-gray-400">&gt;</span>
              </button>
            </div>

            <div className="flex gap-4">
              {promoProducts.map(p => (
                <Link key={p.id} to={`/producto/${p.id}`} className="relative w-1/2 aspect-[3/4] overflow-hidden bg-gray-100">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <p className="absolute bottom-2 left-2 text-white font-medium tracking-widest uppercase text-[10px]">Nuestra nueva colección</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="w-1/3 h-full px-6 py-8 flex flex-col uppercase tracking-widest text-lg font-medium">
            <button onClick={() => setMobileLevel(2)} className="flex items-center text-gray-500 mb-8 w-max">
              <span className="mr-4">&lt;</span> {mobileSub === 'toda' ? 'Toda la ropa' : 'Accesorios'}
            </button>

            <ul className="space-y-6">
              {MENU_DATA[mobileCat]?.[mobileSub]?.map(item => (
                <li key={item}>
                  <Link to={`/${mobileCat}`} className={`block pb-4 border-b border-gray-100 w-full ${linkHoverEffect}`}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </>
  );
};