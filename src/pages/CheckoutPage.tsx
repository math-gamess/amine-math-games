import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Lock, CreditCard, Globe, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
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
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleStripeCheckout = async () => {
    if (!formData.email || !formData.name) {
      setError(t('fill_all_fields'));
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Stripe checkout failed');
      }
    } catch (err: any) {
      setError(err.message);
      setProcessing(processing);
    } finally {
      setProcessing(false);
    }
  };

  const handlePayseraCheckout = () => {
    // Mock Paysera redirect
    setError("Paysera integration is coming soon in this demo.");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>;

  const discountPercent = Math.round(((settings.original_price - settings.sale_price) / settings.original_price) * 100);

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            {t('secure_checkout')}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left Column: Form */}
          <div className="lg:col-span-3 space-y-8">
            <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm">1</span>
                {t('contact_info')}
              </h2>
              <div className="grid gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('full_name')}</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('email_address')}</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com"
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm">2</span>
                {t('payment_method')}
              </h2>
              
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <button 
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'stripe' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-800 hover:border-indigo-200'}`}
                >
                  <CreditCard className={`w-6 h-6 ${paymentMethod === 'stripe' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="text-sm font-bold">Stripe</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'paypal' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-800 hover:border-indigo-200'}`}
                >
                  <Globe className={`w-6 h-6 ${paymentMethod === 'paypal' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="text-sm font-bold">PayPal</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod('paysera')}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'paysera' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-800 hover:border-indigo-200'}`}
                >
                  <Globe className={`w-6 h-6 ${paymentMethod === 'paysera' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="text-sm font-bold">Paysera</span>
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              {paymentMethod === 'stripe' && (
                <button 
                  onClick={handleStripeCheckout}
                  disabled={processing}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-50"
                >
                  {processing ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Lock className="w-5 h-5" />}
                  {t('pay_now')}
                </button>
              )}

              {paymentMethod === 'paypal' && settings.paypal_client_id && (
                <PayPalScriptProvider options={{ "client-id": settings.paypal_client_id }}>
                  <PayPalButtons 
                    style={{ layout: "vertical", shape: "pill" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                          {
                            amount: {
                              currency_code: "USD",
                              value: settings.sale_price,
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      if (actions.order) {
                        const details = await actions.order.capture();
                        // Save sale to DB
                        await fetch('/api/checkout/success', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            name: formData.name || details.payer.name?.given_name,
                            email: formData.email || details.payer.email_address,
                            amount: settings.sale_price,
                            method: 'PayPal',
                            country: details.payer.address?.country_code
                          })
                        });
                        window.location.href = '/download';
                      }
                    }}
                  />
                </PayPalScriptProvider>
              )}

              {paymentMethod === 'paysera' && (
                <button 
                  onClick={handlePayseraCheckout}
                  className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
                >
                  <Globe className="w-5 h-5" />
                  {t('pay_with_paysera')}
                </button>
              )}
            </section>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-6">{t('order_summary')}</h2>
              
              <div className="flex gap-4 mb-8">
                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center overflow-hidden">
                  <img src="https://picsum.photos/seed/bundle/200/200" alt="Product" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Little Genius Spark</h3>
                  <p className="text-sm text-slate-500">15,000+ Activities Bundle</p>
                </div>
              </div>

              <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                <div className="flex justify-between text-slate-500">
                  <span>{t('original_price')}</span>
                  <span className="line-through">${settings.original_price}</span>
                </div>
                <div className="flex justify-between text-emerald-500 font-bold">
                  <span>{t('discount')} ({discountPercent}%)</span>
                  <span>-${settings.original_price - settings.sale_price}</span>
                </div>
                <div className="flex justify-between text-2xl font-black pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span>{t('total')}</span>
                  <span className="text-indigo-600">${settings.sale_price}</span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  {t('lifetime_access')}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  {t('instant_download')}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  {t('resell_rights_included')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
