import { useState } from 'preact/hooks';
import { addToCart } from './cartStore';

interface Props {
  id: string;
  name: string;
  price: number;
  image: string;
  sizes: string[];
  seller: string;
}

export default function AddToCartButton({
  id,
  name,
  price,
  image,
  sizes,
  seller,
}: Props) {
  const [selectedSize, setSelectedSize] = useState('');
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (!selectedSize) return;
    addToCart({ id, name, price, image, size: selectedSize, seller });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div class="space-y-3">
      <div>
        <p class="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
          Size
        </p>
        <div class="flex flex-wrap gap-1.5">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              class={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedSize === size
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleAdd}
        disabled={!selectedSize}
        class={`w-full rounded-xl py-2.5 text-sm font-bold transition-all duration-200 ${
          added
            ? 'scale-95 bg-green-500 text-white'
            : !selectedSize
              ? 'cursor-not-allowed bg-gray-100 text-gray-400'
              : 'bg-primary hover:bg-accent text-white active:scale-95'
        }`}
      >
        {added ? '✓ Added to Cart' : 'Add to Cart'}
      </button>
    </div>
  );
}
