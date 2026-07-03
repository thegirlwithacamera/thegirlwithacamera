'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const messages = {
  fr: {
    title: 'Paiement Annulé',
    subtitle: 'Aucune charge',
    message: 'Votre paiement a été annulé. Aucun argent n\'a été débité de votre compte.',
    reason: 'Vous pouvez revenir à votre panier et réessayer quand vous le souhaitez.',
    keepShopping: 'Continuer vos achats',
    backCart: 'Retourner à la boutique',
    contact: 'Besoin d\'aide?',
    contactUs: 'Nous contacter',
  },
  en: {
    title: 'Payment Cancelled',
    subtitle: 'No charges',
    message: 'Your payment has been cancelled. No charges have been made to your account.',
    reason: 'You can return to your cart and try again whenever you\'re ready.',
    keepShopping: 'Continue Shopping',
    backCart: 'Back to Shop',
    contact: 'Need help?',
    contactUs: 'Contact Us',
  },
};

export default function CancelPage({ params }: { params: Promise<{ lang: 'fr' | 'en' }> }) {
  const [lang, setLang] = useState<'fr' | 'en'>('en');

  useEffect(() => {
    const resolveParams = async () => {
      const { lang: paramLang } = await params;
      setLang(paramLang);
    };
    resolveParams();
  }, [params]);

  const t = messages[lang];

  return (
    <main style={{
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: '60px',
      paddingBottom: '80px',
      background: '#ffffff',
    }}>
      <style>{`
        .cancel-container {
          max-width: 600px;
          text-align: center;
          padding: 60px 40px;
        }
        .cancel-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 30px;
          background: #fff5f5;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
        }
        .cancel-title {
          font-size: 32px;
          font-weight: 400;
          letter-spacing: 0.05em;
          color: #0a0a0a;
          margin-bottom: 12px;
          font-family: 'EB Garamond', serif;
        }
        .cancel-subtitle {
          font-size: 18px;
          color: #666666;
          margin-bottom: 30px;
          font-weight: 300;
        }
        .cancel-message {
          font-size: 14px;
          line-height: 1.8;
          color: #666666;
          margin-bottom: 16px;
        }
        .cancel-reason {
          font-size: 13px;
          line-height: 1.8;
          color: #999999;
          margin-bottom: 40px;
        }
        .button-group {
          display: flex;
          gap: 16px;
          margin-top: 40px;
          flex-wrap: wrap;
        }
        .btn {
          flex: 1;
          min-width: 200px;
          padding: 14px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: 1px solid #0a0a0a;
          background: #ffffff;
          color: #0a0a0a;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }
        .btn:hover {
          background: #0a0a0a;
          color: #ffffff;
        }
        .btn-primary {
          background: #0a0a0a;
          color: #ffffff;
        }
        .btn-primary:hover {
          background: #ffffff;
          color: #0a0a0a;
        }
        @media (max-width: 600px) {
          .cancel-container {
            padding: 40px 20px;
          }
          .cancel-title {
            font-size: 24px;
          }
          .button-group {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="cancel-container">
        {/* Cancel Icon */}
        <div className="cancel-icon">✕</div>

        {/* Title */}
        <h1 className="cancel-title">{t.title}</h1>
        <p className="cancel-subtitle">{t.subtitle}</p>

        {/* Message */}
        <p className="cancel-message">{t.message}</p>
        <p className="cancel-reason">{t.reason}</p>

        {/* Buttons */}
        <div className="button-group">
          <Link href={`/${lang}/shop`} className="btn btn-primary">
            {t.keepShopping}
          </Link>
          <a href="mailto:hello@thegirlwithacamera.com" className="btn">
            {t.contactUs}
          </a>
        </div>
      </div>
    </main>
  );
}
