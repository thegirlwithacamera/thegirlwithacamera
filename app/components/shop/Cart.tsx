'use client';

import { useCart } from './CartContext';

interface CartProps {
  lang?: 'fr' | 'en';
  t?: any;
  onCheckout: (items: any[]) => void;
  isLoading?: boolean;
}

export function ShopCart({ lang = 'en', t, onCheckout, isLoading = false }: CartProps) {
  const { items, total, removeItem, updateQuantity } = useCart();

  // Fallback translations if not provided
  const translations = t || {
    emptyCart: lang === 'fr' ? 'Votre panier est vide' : 'Your cart is empty',
    cartTitle: lang === 'fr' ? 'Panier' : 'Cart',
    each: lang === 'fr' ? 'chacun' : 'each',
    remove: lang === 'fr' ? 'Supprimer' : 'Remove',
    subtotal: lang === 'fr' ? 'Sous-total:' : 'Subtotal:',
    shipping: lang === 'fr' ? 'Livraison:' : 'Shipping:',
    shippingCalc: lang === 'fr' ? 'Calculée à la caisse' : 'Calculated at checkout',
    total: lang === 'fr' ? 'Total:' : 'Total:',
    proceed: lang === 'fr' ? 'Procéder au paiement' : 'Proceed to Checkout',
    processing: lang === 'fr' ? 'Traitement...' : 'Processing...',
    cartItems: lang === 'fr' ? 'article' : 'item',
    cartItems_plural: lang === 'fr' ? 'articles' : 'items',
  };

  if (items.length === 0) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: '#999999',
        fontSize: '14px',
      }}>
        {translations.emptyCart}
      </div>
    );
  }

  const itemCount = items.length;
  const itemLabel = itemCount === 1 ? translations.cartItems : translations.cartItems_plural;

  return (
    <div style={{ padding: '40px', border: '1px solid #e5e5e5' }}>
      <h2 style={{
        fontSize: '16px',
        fontWeight: 500,
        letterSpacing: '0.1em',
        marginBottom: '24px',
        color: '#0a0a0a',
      }}>
        {translations.cartTitle} ({itemCount} {itemLabel})
      </h2>

      {/* Cart Items */}
      <div style={{ marginBottom: '40px' }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              gap: '16px',
              paddingBottom: '16px',
              borderBottom: '1px solid #ebebeb',
              marginBottom: '16px',
            }}
          >
            {/* Product Image */}
            <div style={{
              width: '80px',
              height: '120px',
              overflow: 'hidden',
              backgroundColor: '#f5f5f5',
              flexShrink: 0,
            }}>
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>

            {/* Product Details */}
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.1em',
                color: '#0a0a0a',
                marginBottom: '8px',
              }}>
                {item.name}
              </h3>

              <p style={{
                fontSize: '11px',
                letterSpacing: '0.08em',
                color: '#666666',
                marginBottom: '12px',
              }}>
                €{(item.price / 100).toFixed(2)} {translations.each}
              </p>

              {/* Quantity Control */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  style={{
                    width: '24px',
                    height: '24px',
                    border: '1px solid #e5e5e5',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                  disabled={isLoading}
                >
                  −
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val > 0) {
                      updateQuantity(item.id, val);
                    }
                  }}
                  style={{
                    width: '40px',
                    height: '24px',
                    border: '1px solid #e5e5e5',
                    textAlign: 'center',
                    fontSize: '12px',
                  }}
                  disabled={isLoading}
                  min="1"
                />
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={{
                    width: '24px',
                    height: '24px',
                    border: '1px solid #e5e5e5',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                  disabled={isLoading}
                >
                  +
                </button>
                <span style={{
                  fontSize: '11px',
                  color: '#666666',
                  marginLeft: 'auto',
                  whiteSpace: 'nowrap',
                }}>
                  €{((item.price * item.quantity) / 100).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeItem(item.id)}
              style={{
                alignSelf: 'flex-start',
                fontSize: '10px',
                color: '#999999',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                whiteSpace: 'nowrap',
              }}
              disabled={isLoading}
            >
              {translations.remove}
            </button>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div style={{
        paddingTop: '16px',
        borderTop: '1px solid #ebebeb',
        marginBottom: '24px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px',
          fontSize: '12px',
        }}>
          <span>{translations.subtotal}</span>
          <span>€{(total / 100).toFixed(2)}</span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px',
          fontSize: '12px',
          color: '#666666',
        }}>
          <span>{translations.shipping}</span>
          <span>{translations.shippingCalc}</span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '13px',
          fontWeight: 500,
          letterSpacing: '0.05em',
        }}>
          <span>{translations.total}</span>
          <span>€{(total / 100).toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={() => onCheckout(items)}
        disabled={isLoading || items.length === 0}
        style={{
          width: '100%',
          padding: '14px',
          fontSize: '12px',
          fontWeight: 500,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          backgroundColor: '#0a0a0a',
          color: '#ffffff',
          border: 'none',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.6 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        {isLoading ? translations.processing : translations.proceed}
      </button>
    </div>
  );
}
