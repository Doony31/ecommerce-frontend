import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const fetchCategories = async () => {
  const res = await fetch(`${baseUrl}/api/categories`);
  return res.json();
};

const createProduct = async (productData) => {
  const res = await fetch(`${baseUrl}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (!res.ok) throw new Error('Error al guardar');
  return res.json();
};

export const AdminProductForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const subCategories = categories.filter(c => c.parentId !== null);

  const [formData, setFormData] = useState({
    name: '', description: '', price: '', categoryId: '', images: '',
    stockS: 0, stockM: 0, stockL: 0, stockXL: 0
  });

    const [selectedFiles, setSelectedFiles] = useState([]);

  const { mutate: handleCreate, isPending } = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      navigate('/admin/productos'); // Nos devuelve a la tabla al terminar
    }
  });

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      alert("Por favor, selecciona al menos una imagen.");
      return;
    }

    // 1. PRIMERO SUBIMOS LAS IMÁGENES AL BACKEND
    const imageFormData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      imageFormData.append('images', selectedFiles[i]);
    }

    try {
      const uploadRes = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: imageFormData, // Enviamos los archivos físicos
      });
      
      if (!uploadRes.ok) throw new Error('Error subiendo imágenes');
      
      const { urls } = await uploadRes.json(); // Obtenemos las URLs generadas ("http://localhost:3000/uploads/...")

      // 2. LUEGO GUARDAMOS EL PRODUCTO EN LA BASE DE DATOS
      const productToSave = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        categoryId: formData.categoryId,
        images: urls, // Usamos las URLs que nos devolvió el servidor
        variants: [
          { size: 'S', stock: parseInt(formData.stockS) },
          { size: 'M', stock: parseInt(formData.stockM) },
          { size: 'L', stock: parseInt(formData.stockL) },
          { size: 'XL', stock: parseInt(formData.stockXL) }
        ].filter(v => v.stock >= 0)
      };

      handleCreate(productToSave);
      
    } catch (error) {
      console.error(error);
      alert("Hubo un error al guardar el producto");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold tracking-wide">Nuevo Producto</h2>
        <Link to="/admin/productos" className="text-gray-500 hover:text-black">Cancelar</Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
        
        {/* Información Básica */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Información Básica</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del producto</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio (S/)</label>
              <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-black" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-black">
              <option value="">Selecciona una categoría...</option>
              {subCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.parent.name} - {cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea rows="3" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-black"></textarea>
          </div>
        </div>

        {/* Imágenes */}
    <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Imágenes</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subir fotos desde tu computadora (Máx 5)</label>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={(e) => setSelectedFiles(e.target.files)} 
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer" 
            />
            {/* Vista previa de los nombres de los archivos */}
            {selectedFiles.length > 0 && (
              <ul className="mt-2 text-sm text-gray-500 list-disc list-inside px-2">
                {Array.from(selectedFiles).map((file, i) => (
                  <li key={i}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Inventario por Tallas */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Inventario (Stock por talla)</h3>
          <div className="grid grid-cols-4 gap-4">
            {['S', 'M', 'L', 'XL'].map(size => (
              <div key={size}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Talla {size}</label>
                <input type="number" min="0" value={formData[`stock${size}`]} onChange={e => setFormData({...formData, [`stock${size}`]: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-black" />
              </div>
            ))}
          </div>
        </div>

        {/* Botón Guardar */}
        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={isPending} className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400">
            {isPending ? 'Guardando...' : 'Guardar Producto'}
          </button>
        </div>

      </form>
    </div>
  );
};