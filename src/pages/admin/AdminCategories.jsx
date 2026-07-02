import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const fetchProducts = async () => {
  // Le decimos que use la variable de Vercel en producción, o el localhost si estás programando en tu PC
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  
  const res = await fetch(`${baseUrl}/api/products`);
  if (!res.ok) throw new Error('Error al cargar');
  return res.json();
};
const createCategory = async (data) => {
  const res = await fetch('http://localhost:3000/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

const createCategory = async (data) => {
  // Le decimos que use la variable de Vercel en producción, o el localhost si estás programando en tu PC
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  
  const res = await fetch(`${baseUrl}/api/products`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Error al cargar');
  return res.json();
};

export const AdminCategories = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');

  const { data: categories = [], isLoading } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  
  // Separar padres (Hombre/Mujer) de hijos (Polos/Pantalones)
  const parentCategories = categories.filter(c => c.parentId === null);
  const subCategories = categories.filter(c => c.parentId !== null);

  const { mutate: handleCreate, isPending } = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      setName('');
      setParentId('');
    }
  });

  const onSubmit = (e) => {
    e.preventDefault();
    handleCreate({ name, parentId: parentId || null });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-wide mb-8">Gestión de Categorías</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* FORMULARIO */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-max">
          <h3 className="font-semibold mb-4">Nueva Categoría</h3>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Nombre</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full border p-2 rounded-lg outline-none focus:border-black" placeholder="Ej: Zapatillas" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Pertenece a (Opcional)</label>
              <select value={parentId} onChange={e => setParentId(e.target.value)} className="w-full border p-2 rounded-lg outline-none focus:border-black">
                <option value="">Categoría Principal...</option>
                {parentCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={isPending} className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400">
              {isPending ? 'Guardando...' : 'Crear Categoría'}
            </button>
          </form>
        </div>

        {/* LISTA DE CATEGORÍAS */}
        <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b text-gray-500 uppercase">
              <tr><th className="p-4">Subcategoría</th><th className="p-4">Pertenece a</th></tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? <tr><td className="p-4">Cargando...</td></tr> : subCategories.map(cat => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{cat.name}</td>
                  <td className="p-4 text-gray-500">{cat.parent?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};