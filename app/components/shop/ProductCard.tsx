'use client';

import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="product-card">
      <Image
        src={product.image}
        alt={product.name}
        width={1066}
        height={1600}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div className="product-info">
        <div className="product-name">{product.name}</div>
        <div className="product-price">
          €{(product.price / 100).toFixed(2)}
        </div>
        <button
          onClick={() => onAddToCart(product)}
          style={{
            marginTop: '12px',
            width: '100%',
            padding: '10px',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            backgroundColor: '#0a0a0a',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
