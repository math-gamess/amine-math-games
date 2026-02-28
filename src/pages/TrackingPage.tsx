import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Facebook, Globe, Video, Save, ShieldCheck, AlertCircle } from 'lucide-react';
import DOMPurify from 'dompurify';

export default function TrackingPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [codes, setCodes] = useState({
    fb_pixel: '',
    fb_pixel_status: 'off',
    ga_tag: '',
    ga_tag_status: 'off',
    tiktok_pixel: '',
    tiktok_pixel_status: 'off',
    google_ads_id: '',
    google_ads_label: '',
    google_ads_status: 'off'
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setCodes({
          fb_pixel: data.fb_pixel || '',
          fb_pixel_status: data.fb_pixel_status || 'off',
          ga_tag: data.ga_tag || '',
          ga_tag_status: data.ga_tag_status || 'off',
          tiktok_pixel: data.tiktok_pixel || '',
          tiktok_pixel_status: data.tiktok_pixel_status || 'off',
          google_ads_id: data.google_ads_id || '',
          google_ads_label: data.google_ads_label || '',
          google_ads_status: data.google_ads_status || 'off'
        });
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    // Sanitization: Allow script and noscript tags for tracking pixels
    const sanitizeConfig = {
      FORCE_BODY: true,
      ADD_TAGS: ['script', 'noscript', 'img', 'iframe'],
      ADD_ATTR: ['src', 'async', 'defer', 'height', 'width', 'style', 'frameborder', 'allow', 'allowfullscreen']
    };

    const sanitizedCodes = {
      ...codes,
      fb_pixel: DOMPurify.sanitize(codes.fb_pixel, sanitizeConfig),
      ga_tag: DOMPurify.sanitize(codes.ga_tag, sanitizeConfig),
      tiktok_pixel: DOMPurify.sanitize(codes.tiktok_pixel, sanitizeConfig),
      google_ads_id: DOMPurify.sanitize(codes.google_ads_id, sanitizeConfig),
      google_ads_label: DOMPurify.sanitize(codes.google_ads_label, sanitizeConfig)
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedCodes)
      });

      if (res.ok) {
        setMessage({ type: 'success', text: t('save_changes') + ' ' + t('success', { defaultValue: 'Successful' }) });
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

  const TrackingField = ({ 
    id, 
    label, 
    icon: Icon, 
    value, 
    status, 
    onChange, 
    onStatusChange 
  }: { 
    id: string, 
    label: string, 
    icon: any, 
    value: string, 
    status: string, 
    onChange: (val: string) => void,
    onStatusChange: (val: string) => void
  }) => (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600">
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white">{label}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold uppercase tracking-wider ${status === 'on' ? 'text-emerald-500' : 'text-slate-400'}`}>
            {status.toUpperCase()}
          </span>
          <button
            onClick={() => onStatusChange(status === 'on' ? 'off' : 'on')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              status === 'on' ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                status === 'on' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('pixel_code_placeholder')}
        className="w-full h-32 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono text-sm"
      />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('tracking_codes')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{t('tracking_desc')}</p>
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

      <div className="grid gap-6">
        <TrackingField
          id="fb_pixel"
          label={t('facebook_pixel')}
          icon={Facebook}
          value={codes.fb_pixel}
          status={codes.fb_pixel_status}
          onChange={(val) => setCodes({ ...codes, fb_pixel: val })}
          onStatusChange={(val) => setCodes({ ...codes, fb_pixel_status: val })}
        />
        <TrackingField
          id="ga_tag"
          label={t('google_analytics')}
          icon={Globe}
          value={codes.ga_tag}
          status={codes.ga_tag_status}
          onChange={(val) => setCodes({ ...codes, ga_tag: val })}
          onStatusChange={(val) => setCodes({ ...codes, ga_tag_status: val })}
        />
        <TrackingField
          id="tiktok_pixel"
          label={t('tiktok_pixel')}
          icon={Video}
          value={codes.tiktok_pixel}
          status={codes.tiktok_pixel_status}
          onChange={(val) => setCodes({ ...codes, tiktok_pixel: val })}
          onStatusChange={(val) => setCodes({ ...codes, tiktok_pixel_status: val })}
        />
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">{t('google_ads')}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${codes.google_ads_status === 'on' ? 'text-emerald-500' : 'text-slate-400'}`}>
                {codes.google_ads_status.toUpperCase()}
              </span>
              <button
                onClick={() => setCodes({ ...codes, google_ads_status: codes.google_ads_status === 'on' ? 'off' : 'on' })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  codes.google_ads_status === 'on' ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    codes.google_ads_status === 'on' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('google_ads_conversion_id')}</label>
              <input
                type="text"
                value={codes.google_ads_id}
                onChange={(e) => setCodes({ ...codes, google_ads_id: e.target.value })}
                placeholder={t('google_ads_conversion_id_placeholder')}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('google_ads_conversion_label')}</label>
              <input
                type="text"
                value={codes.google_ads_label}
                onChange={(e) => setCodes({ ...codes, google_ads_label: e.target.value })}
                placeholder={t('google_ads_conversion_label_placeholder')}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
