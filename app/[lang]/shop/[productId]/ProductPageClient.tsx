'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CartProvider, useCart } from '@/app/components/shop/CartContext';
import { getProductById, ProductVariant } from '@/lib/shop-products';

const content = {
  fr: {
    backToShop: 'Retour à la boutique',
    selectFormat: 'Sélectionner un format',
    addToCart: 'Ajouter au panier',
    price: 'Prix',
    description: 'Description',
    formats: 'Formats disponibles',
    notFound: 'Produit non trouvé',
    emailPrompt: 'Adresse Email',
    emailDescription: 'Entrez votre adresse email pour recevoir la confirmation de commande.',
    proceed: 'Procéder au paiement',
    cancel: 'Annuler',
    processing: 'Traitement...',
    continueCheckout: 'Continuer',
    invalidEmail: 'Veuillez entrer une adresse email valide',
    checkoutError: 'Erreur lors du paiement',
  },
  en: {
    backToShop: 'Back to Shop',
    selectFormat: 'Select Format',
    addToCart: 'Add to Cart',
    price: 'Price',
    description: 'Description',
    formats: 'Available Formats',
    notFound: 'Product not found',
    emailPrompt: 'Email Address',
    emailDescription: 'Enter your email address to receive your order confirmation.',
    proceed: 'Proceed to Checkout',
    cancel: 'Cancel',
    processing: 'Processing...',
    continueCheckout: 'Continue',
    invalidEmail: 'Please enter a valid email address',
    checkoutError: 'Error during checkout',
  },
};

function ProductPageInner({ 
  lang, 
  productId 
}: { 
  lang: 'fr' | 'en';
  productId: string;
}) {
  const t = content[lang];
  const product = getProductById(productId);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(product?.variants[0] || null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { addItem } = useCart();

  if (!product) {
    return (
      <main style={{ paddingTop: '60px', paddingBottom: '80px', background: '#ffffff', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', textAlign: 'center' }}>
          <p style={{ fontSize: '18px', color: '#0a0a0a' }}>{t.notFound}</p>
          <Link href={`/${lang}/shop`}>
            <span style={{ color: '#0a0a0a', textDecoration: 'underline' }}>{t.backToShop}</span>
          </Link>
        </div>
      </main>
    );
  }

  const description = lang === 'fr' ? product.descriptionFr : product.descriptionEn;
  const minPrice = Math.min(...product.variants.map(v => v.price)) / 100;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    addItem({
      id: `${product.id}-${selectedVariant.type}`,
      name: `${product.name} - ${selectedVariant.label}`,
      price: selectedVariant.price,
      quantity: 1,
      image: product.image,
    });

    setShowEmailModal(true);
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(customerEmail)) {
      setEmailError(t.invalidEmail);
      return;
    }

    setCheckoutLoading(true);
    try {
      if (!selectedVariant) throw new Error('No variant selected');

      const response = await fetch(`/${lang}/api/shop/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            id: `${product.id}-${selectedVariant.type}`,
            name: `${product.name} - ${selectedVariant.label}`,
            price: selectedVariant.price,
            quantity: 1,
            image: product.image,
          }],
          customerEmail: customerEmail,
          successUrl: `${window.location.origin}/${lang}/shop/success?session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(customerEmail)}`,
          cancelUrl: `${window.location.origin}/${lang}/shop/cancel`,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Checkout failed');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      console.error('Checkout error:', err);
      setEmailError(
        err instanceof Error ? err.message : t.checkoutError
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <main style={{ paddingTop: '60px', paddingBottom: '80px', background: '#ffffff' }}>
      <style>{`
        .product-grid {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
        }
        .product-back {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px 40px 40px;
        }
        @media (max-width: 767px) {
          .product-grid {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 0 20px;
          }
          .product-back {
            padding: 0 20px 32px 20px;
          }
        }
      `}</style>
      <div className="product-back">
        <Link href={`/${lang}/shop`}>
          <span style={{
            fontSize: '13px',
            color: '#666666',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}>
            ← {t.backToShop}
          </span>
        </Link>
      </div>

      <div className="product-grid">
        <div style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1200px) 50vw, 45vw"
          />
        </div>

        <div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 400,
            letterSpacing: '0.05em',
            color: '#0a0a0a',
            marginBottom: '12px',
            fontFamily: "'EB Garamond', serif",
          }}>
            {product.name}
          </h1>

          <p style={{
            fontSize: '18px',
            letterSpacing: '0.05em',
            color: '#0a0a0a',
            marginBottom: '40px',
            fontWeight: 500,
          }}>
            À partir de €{minPrice.toFixed(2)}
          </p>

          <div style={{ marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#666666',
              marginBottom: '16px',
            }}>
              {t.description}
            </h2>
            <p style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#0a0a0a',
              letterSpacing: '0.02em',
            }}>
              {description}
            </p>
          </div>

          <div style={{ marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#666666',
              marginBottom: '20px',
            }}>
              {t.formats}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {product.variants.map((variant) => (
                <button
                  key={variant.type}
                  onClick={() => setSelectedVariant(variant)}
                  style={{
                    padding: '16px',
                    fontSize: '13px',
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    border: selectedVariant?.type === variant.type ? '2px solid #0a0a0a' : '1px solid #e5e5e5',
                    background: selectedVariant?.type === variant.type ? '#0a0a0a' : '#ffffff',
                    color: selectedVariant?.type === variant.type ? '#ffffff' : '#0a0a0a',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>{variant.label}</span>
                  <span>€{(variant.price / 100).toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              border: 'none',
              background: '#0a0a0a',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            {t.addToCart}
          </button>
        </div>
      </div>

      {showEmailModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '4px',
            padding: '40px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 400,
              letterSpacing: '0.05em',
              color: '#0a0a0a',
              marginBottom: '12px',
              fontFamily: "'EB Garamond', serif",
            }}>
              {t.emailPrompt}
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#666666',
              marginBottom: '24px',
              lineHeight: '1.6',
            }}>
              {t.emailDescription}
            </p>

            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => {
                  setCustomerEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                placeholder={lang === 'fr' ? 'votre@email.com' : 'your@email.com'}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  border: emailError ? '1px solid #ff0000' : '1px solid #e5e5e5',
                  borderRadius: '4px',
                  marginBottom: emailError ? '8px' : '24px',
                  fontFamily: 'Inter, sans-serif',
                  boxSizing: 'border-box',
                }}
                disabled={checkoutLoading}
                autoFocus
              />

              {emailError && (
                <p style={{
                  fontSize: '12px',
                  color: '#ff0000',
                  marginBottom: '16px',
                }}>
                  {emailError}
                </p>
              )}

              <div style={{ display: 'flex', gap: '16px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowEmailModal(false);
                    setCustomerEmail('');
                    setEmailError('');
                  }}
                  disabled={checkoutLoading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    border: '1px solid #e5e5e5',
                    background: '#ffffff',
                    color: '#0a0a0a',
                    cursor: checkoutLoading ? 'not-allowed' : 'pointer',
                    opacity: checkoutLoading ? 0.6 : 1,
                    transition: 'all 0.2s',
                  }}
                >
                  {t.cancel}
                </button>

                <button
                  type="submit"
                  disabled={checkoutLoading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    border: 'none',
                    background: '#0a0a0a',
                    color: '#ffffff',
                    cursor: checkoutLoading ? 'not-allowed' : 'pointer',
                    opacity: checkoutLoading ? 0.6 : 1,
                    transition: 'all 0.2s',
                  }}
                >
                  {checkoutLoading ? t.processing : t.continueCheckout}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default function ProductPageWrapper({ 
  lang, 
  productId 
}: { 
  lang: 'fr' | 'en';
  productId: string;
}) {
  return (
    <CartProvider>
      <ProductPageInner lang={lang} productId={productId} />
    </CartProvider>
  );
}
