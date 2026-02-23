import { useState, useEffect } from 'preact/hooks';
import { cartItems, cartTotal, cartCount, clearCart } from './cartStore';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function CheckoutForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');

  useEffect(() => {
    (window as any).onTurnstileSuccess = (token: string) => {
      setTurnstileToken(token);
    };
    (window as any).onTurnstileExpired = () => {
      setTurnstileToken('');
    };
  }, []);

  if (cartCount.value === 0 && status !== 'success') {
    return (
      <div class="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 text-gray-200"
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
        <h2 class="text-xl font-bold text-gray-700">Your cart is empty</h2>
        <p class="text-sm text-gray-400">Add some items before checking out.</p>
        <a
          href="/products"
          class="bg-primary hover:bg-accent mt-2 inline-block rounded-xl px-6 py-3 font-semibold text-white transition-colors"
        >
          Browse Products
        </a>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div class="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div class="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width={2}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 class="text-2xl font-black">Order Received!</h2>
        <p class="max-w-sm text-gray-500">{message}</p>
        <a
          href="/"
          class="bg-primary hover:bg-accent mt-4 inline-block rounded-xl px-8 py-3 font-semibold text-white transition-colors"
        >
          Continue Shopping
        </a>
      </div>
    );
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();

    if (!turnstileToken) {
      setStatus('error');
      setMessage('Please complete the security check.');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch(
        'https://faithful-worker.dejesusmelnard.workers.dev/order',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            phone,
            items: cartItems.value,
            total: cartTotal.value,
            turnstileToken,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        clearCart();
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.message);
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  return (
    <div class="grid items-start gap-12 lg:grid-cols-2">
      {/* Order Summary */}
      <div class="bg-surface rounded-2xl p-6">
        <h2 class="mb-5 text-lg font-bold">Order Summary</h2>
        <ul class="divide-y divide-gray-200">
          {cartItems.value.map((item) => (
            <li key={`${item.id}-${item.size}`} class="flex gap-4 py-4">
              <img
                src={item.image}
                alt={item.name}
                class="h-16 w-16 rounded-xl bg-white object-cover"
              />
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold">{item.name}</p>
                <p class="mt-0.5 text-xs text-gray-400">
                  Size: {item.size} &times; {item.quantity}
                </p>
                <p class="text-accent mt-1 text-sm font-bold">
                  ₱{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div class="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
          <span class="font-medium text-gray-500">Total</span>
          <span class="text-2xl font-black">₱{cartTotal.value.toFixed(2)}</span>
        </div>
      </div>

      {/* Contact Form */}
      <div>
        <h2 class="mb-5 text-lg font-bold">Your Details</h2>
        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="mb-1.5 block text-sm font-semibold text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="John Doe"
              value={name}
              onInput={(e) => setName((e.target as HTMLInputElement).value)}
              class="focus:ring-primary w-full rounded-xl border border-gray-200 px-4 py-3 text-sm transition-shadow focus:border-transparent focus:ring-2 focus:outline-none"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="john@example.com"
              value={email}
              onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
              class="focus:ring-primary w-full rounded-xl border border-gray-200 px-4 py-3 text-sm transition-shadow focus:border-transparent focus:ring-2 focus:outline-none"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-semibold text-gray-700">
              Phone / Contact
            </label>
            <input
              type="tel"
              required
              placeholder="+1 (555) 000-0000"
              value={phone}
              onInput={(e) => setPhone((e.target as HTMLInputElement).value)}
              class="focus:ring-primary w-full rounded-xl border border-gray-200 px-4 py-3 text-sm transition-shadow focus:border-transparent focus:ring-2 focus:outline-none"
            />
          </div>

          <div
            class="cf-turnstile"
            data-sitekey="0x4AAAAAACg2EoLSFxVF0kcx"
            data-theme="light"
            data-size="normal"
            data-callback="onSuccess"
            data-expired-callback="onTurnstileExpired"
          />

          {status === 'error' && (
            <p class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-500">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            class="bg-primary hover:bg-accent mt-2 w-full rounded-xl py-3.5 font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'loading' ? 'Placing Order…' : 'Place Order'}
          </button>

          <p class="text-center text-xs leading-relaxed text-gray-400">
            We'll reach out to confirm your order and arrange payment details.
            No payment is charged now.
          </p>
        </form>
      </div>
    </div>
  );
}
