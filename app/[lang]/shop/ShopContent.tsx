'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { ShopCart } from '@/app/components/shop/Cart';
import { CartProvider, useCart } from '@/app/components/shop/CartContext';
import { SHOP_PRODUCTS } from '@/lib/shop-products';

interface EditionStock {
  editionSize: number;
  soldCount: number;
  remaining: number;
}

const content = {
  fr: {
    title: 'Boutique',
    subtitle: 'Photographs & Prints',
    description: 'Tirages photographiques — une sélection curatée de mes images favorites, imprimées avec soin.',
    shippingNote: 'Livraison internationale 6,95 € — offerte dès 100 € · Impression locale (Europe, UK, USA, Canada, Australie, Japon…) · Expédition sous 5 à 10 jours ouvrés · Retours sous 14 jours',
    loadingProducts: 'Chargement des produits...',
    error: 'Erreur lors du chargement des produits',
    cartTitle: 'Panier',
    emptyCart: 'Votre panier est vide',
    noProducts: 'Aucun produit disponible',
    cartItems: 'article',
    cartItems_plural: 'articles',
    subtotal: 'Sous-total:',
    shipping: 'Livraison:',
    shippingCalc: 'Calculée à la caisse',
    total: 'Total:',
    proceed: 'Procéder au paiement',
    processing: 'Traitement...',
    remove: 'Supprimer',
    each: 'chacun',
    from: 'À partir de',
    soldOut: 'Épuisé',
    lastOne: 'Dernier exemplaire',
    left: (n: number) => `${n} restants`,
  },
  en: {
    title: 'Shop',
    subtitle: 'Photographs & Prints',
    description: 'Photographic prints — a curated selection of my favorite images, printed with care.',
    shippingNote: 'Worldwide shipping €6.95 — free over €100 · Printed locally (Europe, UK, USA, Canada, Australia, Japan…) · Ships within 5-10 business days · 14-day returns',
    loadingProducts: 'Loading products...',
    error: 'Error loading products',
    cartTitle: 'Cart',
    emptyCart: 'Your cart is empty',
    noProducts: 'No products available',
    cartItems: 'item',
    cartItems_plural: 'items',
    subtotal: 'Subtotal:',
    shipping: 'Shipping:',
    shippingCalc: 'Calculated at checkout',
    total: 'Total:',
    proceed: 'Proceed to Checkout',
    processing: 'Processing...',
    remove: 'Remove',
    each: 'each',
    from: 'From',
    soldOut: 'Sold out',
    lastOne: 'Last one left',
    left: (n: number) => `${n} left`,
  },
};

function ShopContentInner({ lang }: { lang: 'fr' | 'en' }) {
  const t = content[lang];
  const products = SHOP_PRODUCTS;
  const { items, clearCart } = useCart();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [editions, setEditions] = useState<Record<string, EditionStock>>({});

  useEffect(() => {
    fetch('/api/shop/editions')
      .then((res) => res.json())
      .then((data) => setEditions(data.editions || {}))
      .catch(() => {
        // Fail open — availability badges are a nice-to-have, not a blocker
      });
  }, []);

  const getMinPrice = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return 0;
    const minPrice = Math.min(...product.variants.map(v => v.price));
    return (minPrice / 100).toFixed(2);
  };

  const renderStockBadge = (productId: string) => {
    const stock = editions[productId];
    if (!stock) return null;
    if (stock.remaining <= 0) {
      return <div className="stock-badge sold-out">{t.soldOut}</div>;
    }
    if (stock.remaining === 1) {
      return <div className="stock-badge">{t.lastOne}</div>;
    }
    return null;
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    setShowEmailModal(true);
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateEmail(customerEmail)) {
      setEmailError(lang === 'fr' ? 'Adresse email invalide' : 'Invalid email address');
      return;
    }
    setCheckoutLoading(true);
    try {
      const response = await fetch(`/${lang}/api/shop/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          customerEmail,
          successUrl: `${window.location.origin}/${lang}/shop/success?session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(customerEmail)}`,
          cancelUrl: `${window.location.origin}/${lang}/shop/cancel`,
        }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Checkout failed');
      }
      const { url } = await response.json();
      clearCart();
      window.location.href = url;
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : t.error);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <main style={{ paddingTop: '60px', paddingBottom: '80px', background: '#ffffff' }}>
      <style>{`
        .shop-container {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 40px;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .shop-products {
          flex: 1;
        }
        .shop-header {
          text-align: center;
          margin-bottom: 60px;
          padding: 0;
        }
        .shop-title {
          font-size: 32px;
          font-weight: 400;
          letter-spacing: 0.05em;
          color: #0a0a0a;
          margin-bottom: 12px;
        }
        .shop-subtitle {
          font-size: 14px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #666666;
          margin-bottom: 20px;
        }
        .shop-description {
          font-size: 13px;
          line-height: 1.8;
          letter-spacing: 0.04em;
          color: #666666;
          max-width: 600px;
          margin: 0 auto;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
          grid-auto-rows: auto;
          align-items: start;
        }
        .products-section {
          margin-bottom: 60px;
        }
        .products-section-title {
          font-size: 13px;
          letter-spacing: 0.08em;
          color: #666666;
          margin-bottom: 28px;
          text-align: center;
        }
        .horizontal-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 22px;
          grid-auto-rows: auto;
          align-items: start;
        }
        .vertical-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
          grid-auto-rows: auto;
          align-items: start;
        }
        .product-card {
          display: block;
          overflow: hidden;
          position: relative;
          background: #f5f5f5;
          border: 1px solid #e5e5e5;
          cursor: pointer;
        }
        .product-card-image {
          width: 100%;
          height: auto;
          display: block;
        }
        .product-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          padding: 16px;
          transform: translateY(100%);
          transition: transform 0.3s ease;
        }
        .product-card:hover .product-info {
          transform: translateY(0);
        }
        .product-name {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.1em;
          color: #0a0a0a;
          margin-bottom: 8px;
        }
        .product-price {
          font-size: 11px;
          letter-spacing: 0.08em;
          color: #666666;
        }
        .product-edition {
          font-size: 10px;
          letter-spacing: 0.06em;
          color: #999999;
          margin-top: 4px;
        }
        .stock-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #0a0a0a;
          color: #ffffff;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 6px 10px;
          z-index: 2;
        }
        .stock-badge.sold-out {
          background: #b03030;
        }
        .product-card.sold-out .product-card-image {
          opacity: 0.5;
        }
        .shop-loading {
          text-align: center;
          padding: 60px 40px;
          font-size: 14px;
          color: #999999;
        }
        .shop-sidebar {
          position: sticky;
          top: 100px;
          height: fit-content;
        }
        @media (max-width: 1024px) {
          .shop-container {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .shop-sidebar {
            position: static;
          }
        }
        @media (max-width: 767px) {
          .shop-container {
            padding: 0 20px;
          }
          .products-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .horizontal-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .vertical-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .shop-title {
            font-size: 24px;
          }
        }
      `}</style>

      <div className="shop-container">
        <div className="shop-products">
          {/* Header */}
          <div className="shop-header">
            <div className="shop-subtitle">{t.subtitle}</div>
            <h1 className="shop-title">{t.title}</h1>
            <p className="shop-description">{t.description}</p>
            <p style={{
              fontSize: '11px',
              letterSpacing: '0.06em',
              color: '#999999',
              maxWidth: '600px',
              margin: '16px auto 0',
              lineHeight: 1.8,
            }}>
              {t.shippingNote}
            </p>
          </div>

          {/* Products Grid - Grouped by Orientation */}
          {products.length === 0 && (
            <div className="shop-loading">{t.noProducts}</div>
          )}

          {/* Horizontal Images */}
          {products.filter(p => p.orientation === 'horizontal').length > 0 && (
            <div className="products-section">
              <div className="horizontal-grid">
                {products.filter(p => p.orientation === 'horizontal').map((product) => (
                  <Link
                    key={product.id}
                    href={`/${lang}/shop/${product.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className={`product-card${editions[product.id]?.remaining === 0 ? ' sold-out' : ''}`}>
                      {renderStockBadge(product.id)}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-card-image"
                      />
                      <div className="product-info">
                        <div className="product-name">{product.name}</div>
                        <div className="product-price">
                          {t.from} €{getMinPrice(product.id)}
                        </div>
                        {product.editionSize !== undefined && editions[product.id] && (
                          <div className="product-edition">
                            {editions[product.id].remaining > 0
                              ? `${t.left(editions[product.id].remaining)} / ${product.editionSize}`
                              : t.soldOut}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Vertical Images */}
          {products.filter(p => p.orientation === 'vertical').length > 0 && (
            <div className="products-section">
              <div className="vertical-grid">
                {products.filter(p => p.orientation === 'vertical').map((product) => (
                  <Link
                    key={product.id}
                    href={`/${lang}/shop/${product.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className={`product-card${editions[product.id]?.remaining === 0 ? ' sold-out' : ''}`}>
                      {renderStockBadge(product.id)}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-card-image"
                      />
                      <div className="product-info">
                        <div className="product-name">{product.name}</div>
                        <div className="product-price">
                          {t.from} €{getMinPrice(product.id)}
                        </div>
                        {product.editionSize !== undefined && editions[product.id] && (
                          <div className="product-edition">
                            {editions[product.id].remaining > 0
                              ? `${t.left(editions[product.id].remaining)} / ${product.editionSize}`
                              : t.soldOut}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Cart */}
        <div className="shop-sidebar">
          <ShopCart
            lang={lang}
            t={t}
            onCheckout={handleCheckout}
            isLoading={checkoutLoading}
          />
        </div>
      </div>

      {/* Modal email checkout */}
      {showEmailModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            background: '#ffffff', padding: '48px 40px',
            maxWidth: '480px', width: '90%',
            boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
          }}>
            <p style={{ fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#b0b0b0', marginBottom: '20px' }}>
              {lang === 'fr' ? 'Paiement' : 'Checkout'}
            </p>
            <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: '28px', fontWeight: 400, fontStyle: 'italic', color: '#0a0a0a', marginBottom: '8px' }}>
              {lang === 'fr' ? 'Votre adresse email' : 'Your email address'}
            </h2>
            <p style={{ fontSize: '13px', color: '#9a9a9a', lineHeight: 1.7, marginBottom: '32px' }}>
              {lang === 'fr'
                ? 'Pour recevoir la confirmation de commande.'
                : 'To receive your order confirmation.'}
            </p>
            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#b0b0b0', marginBottom: '8px' }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={e => { setCustomerEmail(e.target.value); setEmailError(''); }}
                  placeholder={lang === 'fr' ? 'votre@email.com' : 'your@email.com'}
                  autoFocus
                  disabled={checkoutLoading}
                  style={{
                    width: '100%', padding: '12px 0',
                    background: 'transparent', border: 'none',
                    borderBottom: emailError ? '1px solid #cc3333' : '1px solid #d8d8d8',
                    fontSize: '14px', color: '#0a0a0a', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                {emailError && <p style={{ fontSize: '12px', color: '#cc3333', marginTop: '6px' }}>{emailError}</p>}
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => { setShowEmailModal(false); setCustomerEmail(''); setEmailError(''); }}
                  disabled={checkoutLoading}
                  style={{
                    flex: 1, padding: '14px', fontSize: '9px', fontWeight: 500,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    border: '1px solid #d8d8d8', background: '#ffffff',
                    color: '#0a0a0a', cursor: 'pointer',
                  }}
                >
                  {lang === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={checkoutLoading}
                  style={{
                    flex: 2, padding: '14px', fontSize: '9px', fontWeight: 500,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    border: 'none', background: '#0a0a0a', color: '#ffffff',
                    cursor: checkoutLoading ? 'not-allowed' : 'pointer',
                    opacity: checkoutLoading ? 0.6 : 1,
                  }}
                >
                  {checkoutLoading ? '...' : (lang === 'fr' ? 'Procéder au paiement' : 'Proceed to Checkout')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: t.title,
        description: t.description,
        url: `https://thegirlwithacamera.com/${lang}/shop`,
      })}} />
    </main>
  );
}

export function ShopContent({ lang }: { lang: 'fr' | 'en' }) {
  return (
    <CartProvider>
      <ShopContentInner lang={lang} />
    </CartProvider>
  );
}
