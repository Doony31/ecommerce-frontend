import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <div 
      className="relative h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{ 
        backgroundImage: "url('https://res.cloudinary.com/dci7nuk8u/image/upload/v1774619864/PoloAzul1_jlmlij.jpg')" 
      }}
    >
      <div className="relative z-10 text-center text-white px-4 mt-16">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
          NUEVA COLECCIÓN
        </h1>
        
        <p className="text-lg md:text-2xl font-light mb-8 max-w-2xl mx-auto drop-shadow-md">
          Descubre nuestra línea exclusiva de ropa premium. 
          Diseños modernos y el mejor ajuste para tu estilo de vida.
        </p>
        
        <Link 
          to="/tienda" 
          className="inline-block bg-white text-black font-semibold px-8 py-4 rounded-none hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-lg uppercase tracking-wider"
        >
          Ver Productos
        </Link>
      </div>
    </div>
  );
};