import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const fetchProducts = async () => {
  const res = await fetch(`${baseUrl}/api/products`);
  if (!res.ok) throw new Error('Error al cargar');
  return res.json();
};

const deleteProduct = async (id) => {
  const res = await fetch(`${baseUrl}/api/products/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar');
  return res.json();
};

export const AdminProducts = () => {
    const queryClient = useQueryClient();
    const { data: products = [], isLoading } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });
   
    const { mutate: handleDelete } = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
        // Si se borra con éxito, le decimos a React que vuelva a pedir la lista de productos
        queryClient.invalidateQueries(['products']); 
        }
    });

return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold tracking-wide">Gestión de Productos</h2>
        {/* Cambiamos el botón por un Link que nos llevará al formulario */}
        <Link to="/admin/productos/nuevo" className="px-6 py-3 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
          + Nuevo Producto
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
              <th className="p-4 font-medium">Producto</th>
              <th className="p-4 font-medium">Precio</th>
              <th className="p-4 font-medium">Categoría</th>
              <th className="p-4 font-medium">Stock Total</th>
              <th className="p-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {isLoading ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">Cargando datos...</td></tr>
            ) : (
              products.map((product) => {
                const totalStock = product.variants?.reduce((acc, v) => acc + v.stock, 0) || 0;
                
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 flex items-center gap-4">
                      <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded object-cover bg-gray-100" />
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </td>
                    <td className="p-4 text-gray-600">S/ {Number(product.price).toFixed(2)}</td>
                    <td className="p-4 text-gray-600">{product.category?.name || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${totalStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {totalStock > 0 ? `${totalStock} en stock` : 'Agotado'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-3">
                        <Link to={`/admin/productos/editar/${product.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                            Editar
                        </Link>
                      {/* Conectamos la función handleDelete al botón */}
                      <button 
                        onClick={() => {
                          if(window.confirm(`¿Seguro que deseas eliminar ${product.name}?`)) {
                            handleDelete(product.id);
                          }
                        }} 
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};