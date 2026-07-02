import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { Hombre } from './pages/Hombre';
import { Mujer } from './pages/Mujer';
import { ScrollToTop } from './components/ScrollToTop';
import { Cart } from './pages/Cart';

import { AdminLayout } from './components/AdminLayout';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminProductForm } from './pages/admin/AdminProductForm';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminProductEdit } from './pages/admin/AdminProductEdit';

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="producto/:id" element={<ProductDetail />} />
            <Route path="/hombre" element={<Hombre />} />
            <Route path="/mujer" element={<Mujer />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminProducts />} /> 
            <Route path="productos" element={<AdminProducts />} />
            <Route path="productos/nuevo" element={<AdminProductForm />} />
            <Route path="productos/editar/:id" element={<AdminProductEdit />} />
            <Route path="categorias" element={<AdminCategories />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App
