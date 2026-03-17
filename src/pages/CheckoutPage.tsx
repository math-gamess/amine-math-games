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
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        
        // Verify response integrity
        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid API response: Expected JSON");
        }

        const data = await res.json();
        setSettings(data);
      } catch (err) {
        console.error("Settings Load Error:", err);
        // Fallback values to prevent white screen if API fails (404/500)
        setSettings({
          original_price: 197,
          sale_price: 5,
          paypal_client_id: "" 
        });
      } finally {
        // Stop spinner regardless of success or failure
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Safe discount calculation helper
  const calculateDiscount = () => {
    if (!settings || !settings.original_price || settings.original_price === 0) return 0;
    const diff = settings.original_price - settings.sale_price;
    return Math.round((diff / settings.original_price) * 100);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  const discountPercent = calculateDiscount();

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Rest of your JSX remains the same */}
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
          {/* Form and Summary Sections... */}
          <div className="lg:col-span-3 space-y-8">
             {/* Contact and Payment sections here */}
             <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm">1</span>
                  {t('contact_info')}
                </h2>
                {/* Form Inputs... */}
                <div className="grid gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('full_name')}</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Name"
                      className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                    />
                  </div>
                </div>
             </section>
          </div>
          
          {/* Order Summary Column */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-6">{t('order_summary')}</h2>
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
