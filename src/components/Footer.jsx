import { Link } from 'react-router-dom';

export const Footer = () => {
  // Función para que la flechita te lleve arriba suavemente
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    // Usamos un gris súper oscuro, casi negro, tal cual tu diseño
    <footer className="bg-[#0f0f0f] text-white pt-20 pb-8 px-4 md:px-12 w-full">
      <div className="max-w-[1600px] mx-auto">
        
        {/* SECCIÓN SUPERIOR: 4 Columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* Columna 1: Redes Sociales (Reemplazo del Email) */}
          <div className="lg:pr-8">
            <h3 className="text-xs font-semibold tracking-widest text-gray-400 mb-6 uppercase">
              Conecta con nosotros
            </h3>
            <p className="text-sm font-light text-gray-300 mb-6 leading-relaxed">
              Síguenos en nuestras redes sociales para enterarte de ofertas especiales, nuevos lanzamientos y colecciones exclusivas.
            </p>
            {/* Íconos de FontAwesome */}
            <div className="flex gap-6 text-2xl">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-gray-400 transition-colors">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-gray-400 transition-colors">
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-gray-400 transition-colors">
                <i className="fa-brands fa-youtube"></i>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-gray-400 transition-colors">
                <i className="fa-brands fa-tiktok"></i>
              </a>
            </div>
          </div>

          {/* Columna 2: The Brand */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-gray-400 mb-6 uppercase">The Brand</h3>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-sm font-light hover:text-gray-400 transition-colors">About</Link></li>
              <li><Link to="/values" className="text-sm font-light hover:text-gray-400 transition-colors">Values</Link></li>
              <li><Link to="/contact" className="text-sm font-light hover:text-gray-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Columna 3: Legal */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-gray-400 mb-6 uppercase">Legal</h3>
            <ul className="space-y-4">
              <li><Link to="/shipping-policy" className="text-sm font-light hover:text-gray-400 transition-colors">Shipping Policy</Link></li>
              <li><Link to="/refund-policy" className="text-sm font-light hover:text-gray-400 transition-colors">Refund Policy</Link></li>
              <li><Link to="/privacy-policy" className="text-sm font-light hover:text-gray-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Columna 4: Shop */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-gray-400 mb-6 uppercase">Shop</h3>
            <ul className="space-y-4">
              <li><Link to="/mujer" className="text-sm font-light hover:text-gray-400 transition-colors">Women</Link></li>
              <li><Link to="/hombre" className="text-sm font-light hover:text-gray-400 transition-colors">Men</Link></li>
              <li><Link to="/accesorios" className="text-sm font-light hover:text-gray-400 transition-colors">Accessories</Link></li>
            </ul>
          </div>

        </div>

        {/* SECCIÓN INFERIOR: Línea separadora, Copyright y Flecha */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 font-light tracking-wide">
            Copyright © 2026 TU_MARCA. All rights reserved.
          </p>
          
          {/* Botón Scroll to Top */}
          <button 
            onClick={scrollToTop}
            className="w-10 h-10 border border-gray-800 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black hover:border-white transition-all duration-300"
            aria-label="Volver arriba"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6"/></svg>
          </button>
        </div>
        
      </div>
    </footer>
  );
};