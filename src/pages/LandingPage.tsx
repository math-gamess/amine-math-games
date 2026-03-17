import React, { useEffect, useState, useRef } from 'react';
import { 
  CheckCircle2, 
  Star, 
  Download, 
  ShieldCheck, 
  Zap, 
  BookOpen, 
  Calculator, 
  Calendar, 
  TrendingUp, 
  ChevronDown, 
  Lock, 
  CreditCard, 
  Globe, 
  Sun, 
  Moon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from '../components/Logo';
import { useTheme } from '../context/ThemeContext';
import { saveUrlParams, trackEvent } from '../utils/tracking';

// --- Components ---

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[var(--border-color)] py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full justify-between items-center text-left font-semibold text-[var(--text-main)] hover:text-indigo-600 transition-colors"
      >
        <span>{question}</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pt-2 text-[var(--text-muted)] leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Page ---

export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<any>(null);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveUrlParams();
    trackEvent('page_view');
    
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
      })
      .catch(err => {
        console.error('Failed to load settings:', err);
        setSettings({
          original_price: '197',
          sale_price: '5',
          is_discount_active: 'true'
        });
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Logic Helpers ---

  const handleCheckoutNavigation = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    // محاولة التتبع بشكل آمن جداً
    try {
      if (typeof window !== 'undefined') {
        const win = window as any;
        const value = settings?.sale_price || '5';
        if (win.fbq) win.fbq('track', 'InitiateCheckout', { value, currency: 'USD' });
        if (win.ttq) win.ttq.track('InitiateCheckout');
      }
    } catch (err) {
      console.error("Tracking error:", err);
    }

    trackEvent('begin_checkout');
    
    // الانتقال الفوري لضمان عدم التعليق
    navigate('/checkout');
  };

  const isRTL = i18n.language === 'ar';
  const discountPercent = settings ? Math.round(((parseFloat(settings.original_price) - parseFloat(settings.sale_price)) / parseFloat(settings.original_price)) * 100) : 0;

  if (!settings) return null;

  return (
    <div className={`min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-[var(--bg-card)]/80 backdrop-blur-md border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button 
              onClick={handleCheckoutNavigation}
              className="bg-indigo-600 text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-indigo-700 transition-all"
            >
              {t('get_access')}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              {t('hero_title', { count: 12000 })}
            </h1>
            <p className="text-xl text-[var(--text-muted)] mb-10 max-w-2xl mx-auto">
              {t('hero_subtitle')}
            </p>
            <button 
              onClick={handleCheckoutNavigation}
              className="bg-indigo-600 text-white px-10 py-4 rounded-2xl text-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
            >
              <Download className="w-6 h-6" />
              {t('download_now')}
            </button>
          </motion.div>
        </section>

        {/* Pricing Card */}
        <section className="py-20 bg-[var(--bg-card)]">
          <div className="max-w-md mx-auto px-4">
            <div className="bg-[var(--bg-main)] rounded-[2.5rem] p-8 border-2 border-indigo-600 shadow-2xl relative">
              {settings.is_discount_active === 'true' && (
                <div className="absolute -top-4 right-4 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                  -{discountPercent}% OFF
                </div>
              )}
              <h3 className="text-2xl font-bold mb-4 text-center">{t('limited_offer')}</h3>
              <div className="flex justify-center items-center gap-3 mb-8">
                <span className="text-3xl text-gray-400 line-through">${settings.original_price}</span>
                <span className="text-6xl font-black text-indigo-600">${settings.sale_price}</span>
              </div>
              <button 
                onClick={handleCheckoutNavigation}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-xl hover:bg-indigo-700 shadow-lg"
              >
                {t('get_access')}
              </button>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <Lock className="w-4 h-4" /> {t('secure_checkout')}
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <CreditCard className="w-4 h-4" /> {t('stripe_paypal')}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">{t('faq')}</h2>
          <FAQItem question={t('faq_q1')} answer={t('faq_a1')} />
          <FAQItem question={t('faq_q2')} answer={t('faq_a2')} />
        </section>
      </main>

      <footer className="py-10 text-center border-t border-[var(--border-color)]">
        <Logo />
        <p className="mt-4 text-sm text-[var(--text-muted)]">
          © {new Date().getFullYear()} PLRYO. {t('rights_reserved')}
        </p>
      </footer>
    </div>
  );
}
