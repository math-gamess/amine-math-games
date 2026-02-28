import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, CheckCircle2, FileText, ExternalLink, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function DownloadPage() {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>;

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <Logo />
          <Link to="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t('back_to_home')}
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black mb-4">{t('payment_successful')}</h1>
          <p className="text-xl text-slate-500">{t('download_ready_desc')}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-indigo-500/5 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              {t('your_files')}
            </h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{products.length} {t('files')}</span>
          </div>

          <div className="space-y-4">
            {products.length > 0 ? products.map((product) => (
              <div key={product.id} className="group flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{product.original_name}</h3>
                    <p className="text-xs text-slate-500">{(product.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            )) : (
              <div className="text-center py-12 text-slate-500">
                <p>{t('no_files_available')}</p>
              </div>
            )}
          </div>

          <div className="mt-12 p-6 rounded-3xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20">
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-indigo-600 mt-1" />
              <div>
                <h3 className="font-bold text-indigo-900 dark:text-indigo-100">{t('email_sent_title')}</h3>
                <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">{t('email_sent_desc')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-slate-400 mb-4">{t('need_help')}</p>
          <a href="mailto:support@plryo.com" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:underline">
            support@plryo.com
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </main>
    </div>
  );
}
