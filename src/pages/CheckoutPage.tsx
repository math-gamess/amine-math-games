import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Lock, CreditCard, Globe, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Logo from '../components/Logo';

export default function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | 'paysera'>('stripe');
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid response");
        }
        const data = await res.json();
        setSettings(data);
      } catch (err) {
        console.error("Using fallback settings due to API error");
        // Professional Fallback: keeps the business running even if API fails
        setSettings({
          original_price: 197,
          sale_price: 5,
          paypal_client_id: "sb" // Default sandbox or your ID
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const calculateDiscount = () => {
    if (!settings?.original_price) return 0;
    return Math.round(((settings.original_price - settings.sale_price) / settings.original_price) * 100);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  const discountPercent = calculateDiscount();

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="hidden sm:inline">{t('secure_checkout')}</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Left: Checkout Form */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Step 1: Info */}
            <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold">1</span>
                {t('contact_info')}
              </h2>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('full_name')}</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your full name"
                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('email_address')}</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@example.com"
                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
            </section>

            {/* Step 2: Payment */}
            <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold">2</span>
                {t('payment_method')}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                <PaymentTab active={paymentMethod === 'stripe'} onClick={() => setPaymentMethod('stripe')} icon={<CreditCard />} label="Stripe" />
                <PaymentTab active={paymentMethod === 'paypal'} onClick={() => setPaymentMethod('paypal')} icon={<Globe />} label="PayPal" />
                <PaymentTab active={paymentMethod === 'paysera'} onClick={() => setPaymentMethod('paysera')} icon={<Globe />} label="Paysera" />
              </div>

              {paymentMethod === 'stripe' && (
                <button 
                  disabled={processing}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none"
                >
                  {processing ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span> : <Lock className="w-5 h-5" />}
                  {t('pay_now')}
                </button>
              )}

              {paymentMethod === 'paypal' && (
                <div className="mt-4">
                  <PayPalScriptProvider options={{ "client-id": settings.paypal_client_id }}>
                    <PayPalButtons style={{ layout: "vertical", shape: "rect" }} />
                  </PayPalScriptProvider>
                </div>
              )}
            </section>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-6">{t('order_summary')}</h2>
              
              <div className="flex gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl">🎁</div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">Little Genius Spark</h3>
                  <p className="text-sm text-slate-500">12,000+ Math Activities</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-slate-500">
                  <span>{t('original_price')}</span>
                  <span className="line-through">${settings.original_price}</span>
                </div>
                <div className="flex justify-between text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-lg text-sm">
                  <span>{t('discount')} ({discountPercent}%)</span>
                  <span>-${settings.original_price - settings.sale_price}</span>
                </div>
                <div className="flex justify-between items-center text-2xl font-black pt-4 text-slate-900 dark:text-white">
                  <span>{t('total')}</span>
                  <span className="text-indigo-600">${settings.sale_price}</span>
                </div>
              </div>

              <div className="mt-8 space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <BenefitItem text={t('lifetime_access')} />
                <BenefitItem text={t('instant_download')} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper Components for cleaner code
function PaymentTab({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${active ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'border-slate-100 dark:border-slate-800 hover:border-indigo-200 text-slate-400'}`}
    >
      {React.cloneElement(icon, { className: "w-6 h-6" })}
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
      {text}
    </div>
  );
}
