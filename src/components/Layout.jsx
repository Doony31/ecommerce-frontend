import { Outlet } from 'react-router-dom';
import { Navbar } from './NavBar'; // Importamos el componente
import { Footer } from './Footer';
export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};