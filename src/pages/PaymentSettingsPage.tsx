import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Save, ShieldCheck, AlertCircle, Globe, DollarSign } from 'lucide-react';

export default function PaymentSettingsPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [settings, setSettings] = useState({
    stripe_publishable_key: '',
    stripe_secret_key: '',
    paypal_client_id: '',
    paypal_secret: '',
    paysera_project_id: '',
    paysera_password: '',
    payment_mode: 'sandbox'
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings({
          stripe_publishable_key: data.stripe_publishable_key || '',
          stripe_secret_key: data.stripe_secret_key || '',
          paypal_client_id: data.paypal_client_id || '',
          paypal_secret: data.paypal_secret || '',
          paysera_project_id: data.paysera_project_id || '',
          paysera_password: data.paysera_password || '',
          payment_mode: data.payment_mode || 'sandbox'
        });
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (res.ok) {
        setMessage({ type: 'success', text: t('save_changes') + ' ' + t('success') });
      } else {
        throw new Error('Failed to save');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error saving settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>;
  }

  const SettingSection = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
      </div>
      <div className="grid gap-4">
        {children}
      </div>
    </div>
  );

  const InputField = ({ label, value, onChange, type = "text", placeholder = "" }: { label: string, value: string, onChange: (val: string) => void, type?: string, placeholder?: string }) => (
    <div className="space-y-1">
      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono text-sm"
      />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('payment_settings')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{t('payment_settings_desc')}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/20"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : t('save_changes')}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${
          message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-red-50 dark:bg-red-900/20 text-red-600'
        }`}>
          {message.type === 'success' ? <ShieldCheck className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">{t('payment_mode')}</h3>
              <p className="text-xs text-slate-500">{t('payment_mode_desc')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${settings.payment_mode === 'live' ? 'text-emerald-500' : 'text-amber-500'}`}>
              {settings.payment_mode.toUpperCase()}
            </span>
            <button
              onClick={() => setSettings({ ...settings, payment_mode: settings.payment_mode === 'live' ? 'sandbox' : 'live' })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                settings.payment_mode === 'live' ? 'bg-emerald-600' : 'bg-amber-500'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.payment_mode === 'live' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <SettingSection title="Stripe" icon={CreditCard}>
          <InputField 
            label={t('stripe_publishable_key')} 
            value={settings.stripe_publishable_key} 
            onChange={(val) => setSettings({ ...settings, stripe_publishable_key: val })} 
            placeholder="pk_test_..."
          />
          <InputField 
            label={t('stripe_secret_key')} 
            value={settings.stripe_secret_key} 
            onChange={(val) => setSettings({ ...settings, stripe_secret_key: val })} 
            type="password"
            placeholder="sk_test_..."
          />
        </SettingSection>

        <SettingSection title="PayPal" icon={DollarSign}>
          <InputField 
            label={t('paypal_client_id')} 
            value={settings.paypal_client_id} 
            onChange={(val) => setSettings({ ...settings, paypal_client_id: val })} 
          />
          <InputField 
            label={t('paypal_secret')} 
            value={settings.paypal_secret} 
            onChange={(val) => setSettings({ ...settings, paypal_secret: val })} 
            type="password"
          />
        </SettingSection>

        <SettingSection title="Paysera" icon={Globe}>
          <InputField 
            label={t('paysera_project_id')} 
            value={settings.paysera_project_id} 
            onChange={(val) => setSettings({ ...settings, paysera_project_id: val })} 
          />
          <InputField 
            label={t('paysera_password')} 
            value={settings.paysera_password} 
            onChange={(val) => setSettings({ ...settings, paysera_password: val })} 
            type="password"
          />
        </SettingSection>
      </div>
    </div>
  );
}
