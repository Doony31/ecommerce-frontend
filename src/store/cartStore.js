import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,
      toastItem: null, // Guardará el producto que acaba de ser añadido para mostrar la notificación

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set({ isCartOpen: !get().isCartOpen }),

      // Añadimos el parámetro "size" explícitamente
      addToCart: (product, size) => {
        const cart = get().cart;
        const existingItem = cart.find((item) => item.id === product.id && item.size === size);

        // 1. Añadimos el producto al carrito internamente
        if (existingItem) {
          if (existingItem.quantity < existingItem.maxStock) {
            set({
              cart: cart.map((item) =>
                item.id === product.id && item.size === size
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            });
          }
        } else {
          // Buscamos el stock máximo de esa variante en específico
          const variant = product.variants.find(v => v.size === size);
          set({ cart: [...cart, { ...product, size, quantity: 1, maxStock: variant.stock }] });
        }

        // 2. Mostramos la notificación (Toast) y cerramos el carrito si estaba abierto
        set({ toastItem: { ...product, size, quantity: 1 }, isCartOpen: false });

        // 3. Ocultamos la notificación después de 3 segundos
        setTimeout(() => {
          set({ toastItem: null });
        }, 3000);
      },

      removeFromCart: (productId, size) => {
        set({ cart: get().cart.filter((item) => !(item.id === productId && item.size === size)) });
      },

      updateQuantity: (productId, size, newQuantity) => {
        if (newQuantity < 1) return;
        set({
          cart: get().cart.map((item) => {
            if (item.id === productId && item.size === size) {
              const validQuantity = Math.min(newQuantity, item.maxStock);
              return { ...item, quantity: validQuantity };
            }
            return item;
          }),
        });
      },

      getTotalItems: () => get().cart.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () => get().cart.reduce((total, item) => total + (item.price * item.quantity), 0),
    }),
    { name: 'ecommerce-cart-storage' }
  )
);