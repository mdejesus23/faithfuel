import {
  cartItems,
  cartOpen,
  cartTotal,
  removeFromCart,
  updateQuantity,
} from './cartStore';

export default function CartDrawer() {
  return (
    <>
      {/* Backdrop */}
      <div
        class={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          cartOpen.value
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        onClick={() => (cartOpen.value = false)}
      />

      {/* Drawer */}
      <div
        class={`fixed top-0 right-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          cartOpen.value ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div class="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div class="flex items-center gap-2">
            <h2 class="text-lg font-bold">Your Cart</h2>
            {cartItems.value.length > 0 && (
              <span class="bg-accent rounded-full px-2 py-0.5 text-xs font-bold text-white">
                {cartItems.value.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={() => (cartOpen.value = false)}
            class="rounded-lg p-2 transition-colors hover:bg-gray-100"
            aria-label="Close cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width={2}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div class="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.value.length === 0 ? (
            <div class="flex h-full flex-col items-center justify-center gap-3 text-center text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-14 w-14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width={1}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p class="font-semibold text-gray-500">Your cart is empty</p>
              <p class="text-sm">Add a tee to get started.</p>
              <a
                href="/products"
                onClick={() => (cartOpen.value = false)}
                class="bg-primary hover:bg-accent mt-2 inline-block rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                Shop Now
              </a>
            </div>
          ) : (
            <ul class="divide-y divide-gray-100">
              {cartItems.value.map((item) => (
                <li key={`${item.id}-${item.size}`} class="flex gap-4 py-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    class="bg-surface h-18 w-18 shrink-0 rounded-xl object-cover"
                    style={{ width: '72px', height: '72px' }}
                  />
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm leading-snug font-semibold">
                      {item.name}
                    </p>
                    <p class="mt-0.5 text-xs text-gray-400">
                      Size: {item.size}
                    </p>
                    <p class="text-accent mt-1 text-sm font-bold">
                      ₱{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <div class="mt-2 flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.size, item.quantity - 1)
                        }
                        class="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-sm font-bold transition-colors hover:bg-gray-100"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span class="w-5 text-center text-sm font-medium tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.size, item.quantity + 1)
                        }
                        class="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-sm font-bold transition-colors hover:bg-gray-100"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        class="ml-auto text-gray-300 transition-colors hover:text-red-400"
                        aria-label="Remove item"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width={2}
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cartItems.value.length > 0 && (
          <div class="bg-surface border-t border-gray-100 px-6 py-5">
            <div class="mb-4 flex items-center justify-between">
              <span class="text-sm text-gray-500">Subtotal</span>
              <span class="text-xl font-black">
                ₱{cartTotal.value.toFixed(2)}
              </span>
            </div>
            <a
              href="/checkout"
              onClick={() => (cartOpen.value = false)}
              class="bg-primary hover:bg-accent block w-full rounded-xl py-3.5 text-center font-bold text-white transition-colors"
            >
              Proceed to Checkout →
            </a>
            <button
              onClick={() => (cartOpen.value = false)}
              class="mt-3 block w-full text-center text-sm text-gray-400 transition-colors hover:text-gray-600"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
