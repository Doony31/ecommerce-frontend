import { Link } from 'react-router-dom';

export const SizeGuide = () => {
  return (
    <section className="bg-[#f4f2ed] py-24 px-4 text-center flex flex-col items-center justify-center mb-16">
      
      {/* Ícono minimalista de un polo */}
      <svg className="w-8 h-8 mb-6 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.3 5.5l-4.5-2.2a3 3 0 00-2.6 0L12 4 10.8 3.3a3 3 0 00-2.6 0L3.7 5.5A2 2 0 002.5 7.3v1.4c0 .8.7 1.5 1.5 1.5h1v9.8c0 .8.7 1.5 1.5 1.5h11c.8 0 1.5-.7 1.5-1.5V10.2h1c.8 0 1.5-.7 1.5-1.5V7.3c0-.8-.5-1.5-1.2-1.8z" />
      </svg>

      {/* Título principal con fuente serif (opcional) o la que tengas por defecto */}
      <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-8 max-w-2xl tracking-tight">
        Siente la diferencia. Diseños pensados en tu comodidad con las telas más suaves.
      </h2>

      {/* Contenedor de los Links */}
      <div className="flex flex-col sm:flex-row gap-8 items-center">
        
        {/* LINK 1: Mujer (Con el truco de la línea mágica) */}
        <Link to="/guia-mujer" className="group relative inline-block pb-1 font-medium tracking-widest uppercase text-sm text-gray-800">
          GUÍA DE TALLAS - MUJER
          {/* Contenedor que "recorta" todo lo que salga de sus bordes */}
          <span className="absolute bottom-0 left-0 w-full h-[1px] overflow-hidden">
            {/* Línea 1: Se va hacia la derecha (100%) */}
            <span className="absolute top-0 left-0 w-full h-full bg-gray-800 transition-transform duration-300 ease-in-out group-hover:translate-x-full"></span>
            {/* Línea 2: Entra desde la izquierda (-100% a 0) */}
            <span className="absolute top-0 left-0 w-full h-full bg-gray-800 transition-transform duration-300 ease-in-out -translate-x-full group-hover:translate-x-0"></span>
          </span>
        </Link>

        {/* LINK 2: Hombre */}
        <Link to="/guia-hombre" className="group relative inline-block pb-1 font-medium tracking-widest uppercase text-sm text-gray-800">
          GUÍA DE TALLAS - HOMBRE
          <span className="absolute bottom-0 left-0 w-full h-[1px] overflow-hidden">
            <span className="absolute top-0 left-0 w-full h-full bg-gray-800 transition-transform duration-300 ease-in-out group-hover:translate-x-full"></span>
            <span className="absolute top-0 left-0 w-full h-full bg-gray-800 transition-transform duration-300 ease-in-out -translate-x-full group-hover:translate-x-0"></span>
          </span>
        </Link>

      </div>
    </section>
  );
};