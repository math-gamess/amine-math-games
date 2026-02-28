import React, { useEffect, useState } from 'react';
import { 
  DollarSign, 
  Tag, 
  Globe, 
  FileUp, 
  Trash2, 
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState<any>({
    original_price: '',
    sale_price: '',
    is_discount_active: 'false',
    language: 'en'
  });
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/settings').then(res => res.json()),
      fetch('/api/products').then(res => res.json())
    ]).then(([settingsData, productsData]) => {
      setSettings(settingsData);
      setProducts(productsData);
      setLoading(false);
    });
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      i18n.changeLanguage(settings.language);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    // Simulated upload
    setTimeout(async () => {
      await fetch('/api/products/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, size: file.size })
      });
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
      setUploading(false);
    }, 1000);
  };

  if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('settings')}</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your store's configuration and digital assets.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Price Management */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] space-y-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('price_management')}</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('original_price')} ($)</label>
              <input 
                type="number"
                value={settings.original_price}
                onChange={(e) => setSettings({...settings, original_price: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('sale_price')} ($)</label>
              <input 
                type="number"
                value={settings.sale_price}
                onChange={(e) => setSettings({...settings, sale_price: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Enable Discount</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">Show sale price and discount badge</p>
              </div>
            </div>
            <button 
              onClick={() => setSettings({...settings, is_discount_active: settings.is_discount_active === 'true' ? 'false' : 'true'})}
              className={`w-12 h-6 rounded-full transition-all relative ${settings.is_discount_active === 'true' ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.is_discount_active === 'true' ? 'right-1' : 'left-1'}`} />
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('language')}</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { code: 'en', label: 'English' },
                { code: 'ar', label: 'العربية' },
                { code: 'fr', label: 'Français' },
                { code: 'es', label: 'Español' },
                { code: 'de', label: 'Deutsch' }
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSettings({...settings, language: lang.code})}
                  className={`py-2.5 rounded-xl font-bold transition-all border text-sm ${
                    settings.language === lang.code 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleSaveSettings}
            disabled={saving}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
            {t('save_changes')}
          </button>
        </div>

        {/* File Management */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] space-y-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <FileUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('file_management')}</h3>
          </div>

          <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
              <FileUp className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <p className="text-slate-900 dark:text-white font-bold">Upload Product File</p>
              <p className="text-xs text-slate-500">ZIP, PDF, or MP4 (Max 500MB)</p>
            </div>
            <label className="inline-block bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2 rounded-xl font-bold cursor-pointer hover:bg-slate-800 dark:hover:bg-slate-100 transition-all">
              {uploading ? 'Uploading...' : 'Browse Files'}
              <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
            </label>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Recent Uploads</p>
            {products.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-800">
                <AlertCircle className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No files uploaded yet.</p>
              </div>
            ) : products.map((product, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                    <FileUp className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{product.original_name}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-500">{(product.size / 1024 / 1024).toFixed(2)} MB • {new Date(product.uploaded_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
