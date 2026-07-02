import { Link } from 'react-router-dom';

export const MainCategories = () => {
  return (
    <section className="px-4 md:px-8 max-w-[1600px] mx-auto pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        
        {/* === CUADRO 1: ROPA DE MUJER === */}
        {/* El 'group' principal es para detectar cuando el ratón entra en toda la caja */}
        <div className="relative aspect-[4/5] md:aspect-square overflow-hidden group cursor-pointer bg-gray-100">
          <Link to="/mujer" className="absolute inset-0 z-20"></Link> {/* Link invisible que cubre todo */}
          
          {/* Imagen con zoom al hacer hover */}
          <img 
            src="https://res.cloudinary.com/dci7nuk8u/image/upload/v1774719240/woman-portada-seccion_gtlnzh.jpg" 
            alt="Moda Mujer" 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
          />
          
          {/* Gradiente sutil abajo para que el texto blanco siempre se lea */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>

          {/* Texto en la esquina inferior derecha. Usamos 'group-hover' para que se active al pasar el mouse sobre la foto */}
          <div className="absolute bottom-8 right-8 z-30 pointer-events-none">
            <div className="relative inline-block pb-1 text-white font-medium tracking-widest uppercase text-sm">
              SHOP WOMEN'S
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] overflow-hidden">
                <span className="absolute top-0 left-0 w-full h-full bg-white transition-transform duration-500 ease-in-out group-hover:translate-x-full"></span>
                <span className="absolute top-0 left-0 w-full h-full bg-white transition-transform duration-500 ease-in-out -translate-x-full group-hover:translate-x-0"></span>
              </span>
            </div>
          </div>
        </div>

        {/* === CUADRO 2: ROPA DE HOMBRE === */}
        <div className="relative aspect-[4/5] md:aspect-square overflow-hidden group cursor-pointer bg-gray-100">
          <Link to="/hombre" className="absolute inset-0 z-20"></Link>
          
          <img 
            src="https://res.cloudinary.com/dci7nuk8u/image/upload/v1774719240/man-portada-seccion_anv13i.jpg" 
            alt="Moda Hombre" 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>

          <div className="absolute bottom-8 right-8 z-30 pointer-events-none">
            <div className="relative inline-block pb-1 text-white font-medium tracking-widest uppercase text-sm">
              SHOP MEN'S
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] overflow-hidden">
                <span className="absolute top-0 left-0 w-full h-full bg-white transition-transform duration-500 ease-in-out group-hover:translate-x-full"></span>
                <span className="absolute top-0 left-0 w-full h-full bg-white transition-transform duration-500 ease-in-out -translate-x-full group-hover:translate-x-0"></span>
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};