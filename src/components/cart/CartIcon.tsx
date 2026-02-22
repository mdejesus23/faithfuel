import { cartCount, cartOpen } from './cartStore';

export default function CartIcon() {
  return (
    <button
      onClick={() => (cartOpen.value = !cartOpen.value)}
      class="relative rounded-lg p-2 transition-colors hover:bg-gray-100"
      aria-label="Open cart"
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
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
      {cartCount.value > 0 && (
        <span class="bg-accent absolute -top-0.5 -right-0.5 flex h-4.5 min-h-[18px] w-4.5 min-w-[18px] items-center justify-center rounded-full text-[10px] leading-none font-bold text-white">
          {cartCount.value}
        </span>
      )}
    </button>
  );
}
