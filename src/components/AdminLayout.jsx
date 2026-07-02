import { Link, Outlet, useLocation } from 'react-router-dom';

export const AdminLayout = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Productos', path: '/admin/productos' },
    { name: 'Categorías', path: '/admin/categorias' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* BARRA LATERAL (SIDEBAR) */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-20 flex items-center px-8 border-b border-gray-200">
          <h1 className="text-xl font-bold tracking-widest">ADMIN.</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path 
                  ? 'bg-black text-white' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-black'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Link to="/" className="block px-4 py-2 text-sm text-gray-500 hover:text-black transition-colors">
            ← Volver a la tienda
          </Link>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL DINÁMICA */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 lg:p-12 max-w-[1200px] mx-auto">
          {/* Aquí se inyectarán las subpáginas (Dashboard, Productos, etc.) */}
          <Outlet /> 
        </div>
      </main>

    </div>
  );
};