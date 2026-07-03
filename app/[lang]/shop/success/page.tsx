'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const messages = {
  fr: {
    title: 'Commande Confirmée',
    subtitle: 'Merci pour votre achat',
    message: 'Votre commande a été reçue et traitée avec succès.',
    orderRef: 'Numéro de commande:',
    email: 'Un email de confirmation a été envoyé à:',
    shipping: 'Vous recevrez un email de suivi avec les détails de livraison.',
    nextSteps: 'Prochaines étapes',
    checkEmail: 'Vérifiez votre email pour la confirmation de commande',
    track: 'Vous pouvez suivre votre colis avec le numéro de suivi',
    questions: 'Des questions?',
    contact: 'Contactez-nous',
    backShop: 'Retourner à la boutique',
  },
  en: {
    title: 'Order Confirmed',
    subtitle: 'Thank you for your purchase',
    message: 'Your order has been received and processed successfully.',
    orderRef: 'Order number:',
    email: 'A confirmation email has been sent to:',
    shipping: 'You will receive a tracking email with delivery details.',
    nextSteps: 'Next Steps',
    checkEmail: 'Check your email for the order confirmation',
    track: 'You can track your package with the tracking number',
    questions: 'Questions?',
    contact: 'Contact us',
    backShop: 'Back to Shop',
  },
};

export default function SuccessPage({ params }: { params: Promise<{ lang: 'fr' | 'en' }> }) {
  const [lang, setLang] = useState<'fr' | 'en'>('en');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const { lang: paramLang } = await params;
      setLang(paramLang);
    };
    resolveParams();

    // Get session ID and customer email from URL query params
    const searchParams = new URLSearchParams(window.location.search);
    const sid = searchParams.get('session_id');
    const email = searchParams.get('email');

    setSessionId(sid);
    setCustomerEmail(email || 'your@email.com');
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
        .success-container {
          max-width: 600px;
          text-align: center;
          padding: 60px 40px;
        }
        .success-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 30px;
          background: #f0f9f5;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
        }
        .success-title {
          font-size: 32px;
          font-weight: 400;
          letter-spacing: 0.05em;
          color: #0a0a0a;
          margin-bottom: 12px;
          font-family: 'EB Garamond', serif;
        }
        .success-subtitle {
          font-size: 18px;
          color: #666666;
          margin-bottom: 30px;
          font-weight: 300;
        }
        .success-message {
          font-size: 14px;
          line-height: 1.8;
          color: #666666;
          margin-bottom: 40px;
        }
        .order-details {
          background: #f5f5f5;
          border: 1px solid #e5e5e5;
          padding: 30px;
          margin: 30px 0;
          text-align: left;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #ebebeb;
          font-size: 13px;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          color: #666666;
          font-weight: 500;
        }
        .detail-value {
          color: #0a0a0a;
          word-break: break-all;
        }
        .next-steps {
          margin: 40px 0;
          text-align: left;
        }
        .steps-title {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: #0a0a0a;
          margin-bottom: 20px;
          text-transform: uppercase;
        }
        .step {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
          font-size: 13px;
          line-height: 1.6;
        }
        .step-number {
          min-width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #0a0a0a;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
        }
        .step-content {
          color: #666666;
          padding-top: 2px;
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
          .success-container {
            padding: 40px 20px;
          }
          .success-title {
            font-size: 24px;
          }
          .button-group {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="success-container">
        {/* Success Icon */}
        <div className="success-icon">✓</div>

        {/* Title */}
        <h1 className="success-title">{t.title}</h1>
        <p className="success-subtitle">{t.subtitle}</p>

        {/* Message */}
        <p className="success-message">{t.message}</p>

        {/* Order Details */}
        <div className="order-details">
          {sessionId && (
            <div className="detail-row">
              <span className="detail-label">{t.orderRef}</span>
              <span className="detail-value">{sessionId.substring(0, 20)}...</span>
            </div>
          )}
          {customerEmail && (
            <div className="detail-row">
              <span className="detail-label">{t.email}</span>
              <span className="detail-value">{customerEmail}</span>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="next-steps">
          <h3 className="steps-title">{t.nextSteps}</h3>
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">{t.checkEmail}</div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">{t.shipping}</div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">{t.track}</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="button-group">
          <Link href={`/${lang}/shop`} className="btn btn-primary">
            {t.backShop}
          </Link>
          <a href="mailto:hello@thegirlwithacamera.com" className="btn">
            {t.contact}
          </a>
        </div>
      </div>
    </main>
  );
}
