import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams, Link } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const fetchCategories = async () => (await fetch(`${baseUrl}/api/categories`)).json();
const fetchProduct = async (id) => (await fetch(`${baseUrl}/api/products/${id}`)).json();

const updateProduct = async ({ id, data }) => {
  const res = await fetch(`${baseUrl}/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar');
  return res.json();
};

export const AdminProductEdit = () => {
  const { id } = useParams(); // Obtenemos el ID de la URL
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const { data: product, isLoading: isProductLoading } = useQuery({ queryKey: ['product', id], queryFn: () => fetchProduct(id) });
  
  const subCategories = categories.filter(c => c.parentId !== null);

  const [formData, setFormData] = useState({
    name: '', description: '', price: '', categoryId: '', images: '',
    stockS: 0, stockM: 0, stockL: 0, stockXL: 0
  });

  // Llenar el formulario cuando los datos del producto carguen
  useEffect(() => {
    if (product) {
      const sSize = product.variants?.find(v => v.size === 'S')?.stock || 0;
      const mSize = product.variants?.find(v => v.size === 'M')?.stock || 0;
      const lSize = product.variants?.find(v => v.size === 'L')?.stock || 0;
      const xlSize = product.variants?.find(v => v.size === 'XL')?.stock || 0;

      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
        images: product.images.join(', '),
        stockS: sSize, stockM: mSize, stockL: lSize, stockXL: xlSize
      });
    }
  }, [product]);

  const { mutate: handleUpdate, isPending } = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      navigate('/admin/productos');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const productToUpdate = {
      name: formData.name, description: formData.description, price: parseFloat(formData.price), categoryId: formData.categoryId,
      images: formData.images.split(',').map(url => url.trim()).filter(url => url !== ''),
      variants: [
        { size: 'S', stock: parseInt(formData.stockS) }, { size: 'M', stock: parseInt(formData.stockM) },
        { size: 'L', stock: parseInt(formData.stockL) }, { size: 'XL', stock: parseInt(formData.stockXL) }
      ].filter(v => v.stock >= 0)
    };
    handleUpdate({ id, data: productToUpdate });
  };

  if (isProductLoading) return <div className="text-center py-20">Cargando producto...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold tracking-wide">Editar Producto</h2>
        <Link to="/admin/productos" className="text-gray-500 hover:text-black">Cancelar</Link>
      </div>

      {/* REUTILIZAMOS LA MISMA ESTRUCTURA VISUAL QUE EL FORMULARIO DE CREAR */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Información Básica</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Nombre</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-2.5 rounded-lg focus:border-black outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Precio</label>
              <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border p-2.5 rounded-lg focus:border-black outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Categoría</label>
            <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full border p-2.5 rounded-lg focus:border-black outline-none">
              <option value="">Selecciona...</option>
              {subCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.parent?.name} - {cat.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Descripción</label>
            <textarea rows="3" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border p-2.5 rounded-lg focus:border-black outline-none"></textarea>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Imágenes</h3>
          <textarea rows="2" required value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} className="w-full border p-2.5 rounded-lg focus:border-black outline-none"></textarea>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Inventario (Stock por talla)</h3>
          <div className="grid grid-cols-4 gap-4">
            {['S', 'M', 'L', 'XL'].map(size => (
              <div key={size}>
                <label className="block text-sm text-gray-700 mb-1">Talla {size}</label>
                <input type="number" min="0" value={formData[`stock${size}`]} onChange={e => setFormData({...formData, [`stock${size}`]: e.target.value})} className="w-full border p-2.5 rounded-lg focus:border-black outline-none" />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={isPending} className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400">
            {isPending ? 'Actualizando...' : 'Actualizar Producto'}
          </button>
        </div>
      </form>
    </div>
  );
};