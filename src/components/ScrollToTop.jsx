import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  // Extraemos la ruta actual (pathname) de la URL
  const { pathname } = useLocation();

  useEffect(() => {
    // Cada vez que el pathname cambie, el navegador subirá a las coordenadas (0,0)
    window.scrollTo(0, 0);
  }, [pathname]);

  // Este componente no renderiza nada en la pantalla
  return null;
};