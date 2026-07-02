import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

export const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getTotalPrice } = useCartStore();
  const [itemToDelete, setItemToDelete] = useState(null); // Estado para abrir el modal

  // Ícono de basura SVG reutilizable
  const TrashIcon = () => (
    <svg className="w-5 h-5 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
  );

  const confirmDelete = () => {
    removeFromCart(itemToDelete.id, itemToDelete.size);
    setItemToDelete(null);
  };

  // --- NUEVA FUNCIÓN PARA WHATSAPP ---
  const handleWhatsAppCheckout = () => {
    // 1. Número del negocio (Reemplaza con el número de tu cliente, 51 es el código de Perú)
    const numeroWhatsApp = "51987654321"; 

    // 2. Construir la lista de productos iterando sobre el carrito
    const detallePedido = cart.map(item => 
      `- ${item.quantity}x ${item.name} (Talla: ${item.size}) - S/ ${(item.price * item.quantity).toFixed(2)}`
    ).join('%0A'); 
    
    // 3. Obtener el total general
    const total = getTotalPrice().toFixed(2);
    
    // 4. Armar el mensaje completo
    const mensaje = `¡Hola! Me gustaría realizar el siguiente pedido:%0A%0A${detallePedido}%0A%0ATotal a pagar: S/ ${total}%0A%0A¿Me confirmas si tienen stock para proceder con el pago?`;

    // 5. Abrir la ventana de WhatsApp
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank');
  };
  // -----------------------------------

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-[72px]">
        <h1 className="text-2xl font-light tracking-widest uppercase mb-6">Tu bolsa está vacía</h1>
        <Link to="/" className="px-8 py-3 bg-black text-white uppercase tracking-widest text-sm hover:bg-gray-800">
          Descubrir Novedades
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-white pt-[120px] pb-24 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-12">
        
        {/* LISTA DE PRODUCTOS (Izquierda) */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-widest uppercase mb-8">Shopping Bag</h1>
          
          <div className="border-t border-gray-200">
            {cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-6 py-6 border-b border-gray-200">
                <Link to={`/producto/${item.id}`}>
                  <img src={item.images[0]} alt={item.name} className="w-32 h-40 object-cover bg-gray-100" />
                </Link>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <Link to={`/producto/${item.id}`} className="text-sm font-bold uppercase tracking-wide hover:underline">
                        {item.name}
                      </Link>
                      <p className="text-sm font-bold">S/ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">S/ {Number(item.price).toFixed(2)} (Unidad)</p>
                    <p className="text-xs text-gray-500 uppercase mt-2">Color: <span className="text-black font-medium">{item.name.split(' ').pop()}</span></p>
                    <p className="text-xs text-gray-500 uppercase mt-1">Talla: <span className="text-black font-medium">{item.size}</span></p>
                  </div>

                  {/* Controles de Cantidad */}
                  <div className="flex items-center gap-6 mt-4">
                    <button 
                      onClick={() => setItemToDelete(item)} 
                      className="text-gray-400 p-1"
                    >
                      <TrashIcon />
                    </button>
                    
                    <div className="flex items-center border border-gray-300">
                      <button 
                        onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.size, item.quantity - 1) : setItemToDelete(item)}
                        className="px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        {item.quantity > 1 ? '-' : <TrashIcon />}
                      </button>
                      <span className="px-4 text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className={`px-4 py-2 transition-colors ${item.quantity >= item.maxStock ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RESUMEN DEL PEDIDO (Derecha) */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-gray-50 p-8 sticky top-[100px]">
            <h2 className="text-sm font-bold tracking-widest uppercase mb-6">Resumen del Pedido</h2>
            
            <div className="flex justify-between items-center mb-4 text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>S/ {getTotalPrice().toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center py-4 border-t border-b border-gray-200 mb-6">
              <span className="font-bold uppercase tracking-widest text-sm">Total</span>
              <span className="font-bold text-lg">S/ {getTotalPrice().toFixed(2)}</span>
            </div>

            {/* Botón Actualizado */}
            <button 
              onClick={handleWhatsAppCheckout}
              className="w-full py-4 bg-black text-white uppercase tracking-widest text-sm font-bold hover:bg-green-700 transition-colors mb-4 flex justify-center items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 21.492c-1.637 0-3.237-.428-4.654-1.243l-.334-.192-3.46.907.925-3.373-.21-.335c-.895-1.425-1.368-3.075-1.368-4.767 0-4.957 4.04-8.997 9.006-8.997 2.404 0 4.664.936 6.363 2.637 1.7 1.7 2.636 3.96 2.636 6.364 0 4.958-4.04 8.998-9.004 8.998zm0-19.492c-5.787 0-10.495 4.708-10.495 10.495 0 1.85.485 3.655 1.408 5.244l-1.5 5.46 5.587-1.465c1.52.84 3.23 1.282 4.99 1.282 5.785 0 10.493-4.708 10.493-10.494 0-2.802-1.09-5.437-3.07-7.417-1.98-1.98-4.615-3.07-7.413-3.07zM17.766 15.34c-.315-.158-1.868-.923-2.157-1.028-.29-.105-.504-.158-.716.158-.21.316-.817 1.028-1.002 1.24-.184.21-.37.237-.685.08-.316-.158-1.332-.49-2.537-1.566-.938-.838-1.573-1.872-1.758-2.188-.184-.316-.02-.487.138-.644.143-.142.316-.37.474-.555.158-.184.21-.316.316-.527.105-.21.053-.395-.026-.553-.08-.158-.716-1.726-.98-2.363-.26-.62-.524-.536-.716-.546-.185-.01-.397-.01-.608-.01-.21 0-.553.08-.842.395-.29.316-1.106 1.08-1.106 2.633 0 1.554 1.132 3.055 1.29 3.266.158.21 2.227 3.4 5.394 4.76 1.764.757 2.457.87 3.328 1.033 1.01.19 1.954-.08 2.505-.52.613-.49 1.09-1.385 1.248-1.912.158-.527.158-.976.105-1.08-.053-.106-.21-.16-.526-.316z"/></svg>
              Pedir por WhatsApp
            </button>
            <p className="text-[10px] text-gray-500 text-center leading-relaxed">
              Los precios y gastos de envío no están confirmados hasta que hayas llegado a completar la compra.
            </p>
          </div>
        </div>

      </div>

      {/* ==========================================
          MODAL DE CONFIRMACIÓN (Eliminar)
          ========================================== */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setItemToDelete(null)} className="absolute top-4 right-4 hover:opacity-60">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <h3 className="text-lg font-medium tracking-widest uppercase mb-4">Eliminar un artículo</h3>
            <p className="text-gray-600 text-sm mb-8">
              ¿Seguro que quieres eliminar este artículo de tu bolsa de la compra?
            </p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setItemToDelete(null)} 
                className="flex-1 py-3 border border-black text-black font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 py-3 bg-black text-white font-bold uppercase tracking-widest text-xs hover:bg-gray-900 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};