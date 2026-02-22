import { signal, computed, effect } from '@preact/signals';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  image: string;
  quantity: number;
}

export const cartItems = signal<CartItem[]>([]);
export const cartOpen = signal(false);

export const cartCount = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.quantity, 0),
);

export const cartTotal = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
);

// Initialise from localStorage and persist changes (client-side only)
if (typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem('faithfuel-cart');
    if (stored) cartItems.value = JSON.parse(stored);
  } catch {}

  effect(() => {
    localStorage.setItem('faithfuel-cart', JSON.stringify(cartItems.value));
  });
}

export function addToCart(item: Omit<CartItem, 'quantity'>) {
  const existing = cartItems.value.find(
    (i) => i.id === item.id && i.size === item.size,
  );
  if (existing) {
    cartItems.value = cartItems.value.map((i) =>
      i.id === item.id && i.size === item.size
        ? { ...i, quantity: i.quantity + 1 }
        : i,
    );
  } else {
    cartItems.value = [...cartItems.value, { ...item, quantity: 1 }];
  }
  cartOpen.value = true;
}

export function removeFromCart(id: string, size: string) {
  cartItems.value = cartItems.value.filter(
    (i) => !(i.id === id && i.size === size),
  );
}

export function updateQuantity(id: string, size: string, qty: number) {
  if (qty <= 0) {
    removeFromCart(id, size);
  } else {
    cartItems.value = cartItems.value.map((i) =>
      i.id === id && i.size === size ? { ...i, quantity: qty } : i,
    );
  }
}

export function clearCart() {
  cartItems.value = [];
}
