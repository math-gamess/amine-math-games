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
  Mail,
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

interface TestimonialProps {
  name: string;
  role: string;
  content: string;
  image: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ name, role, content, image }) => (
  <div className="bg-[var(--bg-card)] p-6 rounded-2xl shadow-sm border border-[var(--border-color)] flex flex-col h-full transition-colors">
    <div className="flex items-center gap-4 mb-4">
      <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/20" referrerPolicy="no-referrer" />
      <div>
        <p className="font-bold text-[var(--text-main)]">{name}</p>
        <p className="text-sm text-[var(--text-muted)]">{role}</p>
      </div>
    </div>
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
    <p className="text-[var(--text-muted)] italic mb-6 flex-grow leading-relaxed">"{content}"</p>
  </div>
);

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);
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
        const savedLang = localStorage.getItem('i18nextLng');
        if (!savedLang) {
          const browserLang = navigator.language.split('-')[0];
          const supported = ['en', 'ar', 'fr', 'es', 'de', 'fil'];
          if (supported.includes(browserLang)) {
            i18n.changeLanguage(browserLang);
          }
        }
      })
      .catch(err => {
        console.error('Failed to load settings:', err);
        setSettings({
          original_price: '197',
          sale_price: '5',
          is_discount_active: 'true'
        });
      });
  }, [i18n]);

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

  const triggerPurchaseEvent = () => {
    if (!settings) return;
    const value = parseFloat(settings.sale_price) || 5.0;
    const currency = 'USD';

    try {
      if (typeof window !== 'undefined') {
        const win = window as any;
        // Facebook
        if (win.fbq) win.fbq('track', 'Purchase', { value, currency });
        // TikTok
        if (win.ttq) win.ttq.track('CompletePayment', { value, currency });
        // Google Ads & GA4
        if (win.gtag) {
          if (settings.google_ads_status === 'on' && settings.google_ads_id && settings.google_ads_label) {
            win.gtag('event', 'conversion', {
              'send_to': `${settings.google_ads_id}/${settings.google_ads_label}`,
              'value': value,
              'currency': currency
            });
          }
          win.gtag('event', 'purchase', {
            value: value,
            currency: currency,
            items: [{ item_id: 'bundle_1', item_name: 'Little Genius Spark Bundle' }]
          });
        }
      }
    } catch (err) {
      console.error("Tracking failed:", err);
    }
  };

  const handleCheckoutNavigation = () => {
    triggerPurchaseEvent();
    trackEvent('begin_checkout');
    // الانتقال بعد تأخير بسيط لضمان تنفيذ التتبع
    setTimeout(() => {
      navigate('/checkout');
    }, 150);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangMenuOpen(false);
  };

  const isRTL = i18n.language === 'ar';
  
  // تصحيح حساب الخصم
  const discountPercent = settings 
    ? Math.round(((parseFloat(settings.original_price) - parseFloat(settings.sale_price)) / parseFloat(settings.original_price)) * 100) 
    : 0;

  // Script Injection
  useEffect(() => {
    if (settings) {
      const injectCode = (code: string, id: string) => {
        if (!code) return;
        const existing = document.getElementById(id);
        if (existing) existing.remove();
        const container = document.createElement('div');
        container.id = id;
        container.innerHTML = code;
        const scripts = container.querySelectorAll('script');
        scripts.forEach(oldScript => {
          const newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
          newScript.appendChild(document.createTextNode(oldScript.innerHTML));
          oldScript.parentNode?.replaceChild(newScript, oldScript);
        });
        document.head.appendChild(container);
      };

      if (settings.fb_pixel_status === 'on') injectCode(settings.fb_pixel, 'fb-pixel-container');
      if (settings.ga_tag_status === 'on') injectCode(settings.ga_tag, 'ga-tag-container');
      if (settings.tiktok_pixel_status === 'on') injectCode(settings.tiktok_pixel, 'tiktok-pixel-container');

      if (settings.google_ads_status === 'on' && settings.google_ads_id) {
        const adsId = settings.google_ads_id;
        const s1 = document.createElement('script');
        s1.async = true; s1.src = `https://www.googletagmanager.com/gtag/js?id=${adsId}`;
        const s2 = document.createElement('script');
        s2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${adsId}');`;
        document.head.appendChild(s1); document.head.appendChild(s2);
      }
    }
  }, [settings]);

  if (!settings) return null;

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
    { code: 'de', label: 'Deutsch' },
    { code: 'fil', label: 'Filipino' }
  ];

  const testimonials = [
    { name: "Sarah J.", role: "Teacher", content: t('testimonial_1_content'), image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" },
    { name: "David M.", role: "Parent", content: t('testimonial_2_content'), image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100" },
    { name: "Elena R.", role: "Entrepreneur", content: t('testimonial_3_content'), image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" },
    { name: "Ahmed K.", role: "Educator", content: t('testimonial_4_content'), image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" },
    { name: "Jessica L.", role: "Mom", content: t('testimonial_5_content'), image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" }
  ];

  return (
    <div className={`min-h-screen bg-[var(--bg-main)] font-sans text-[var(--text-main)] transition-colors ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--bg-card)]/80 backdrop-blur-md border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden lg:flex gap-8 text-sm font-medium text-[var(--text-muted)]">
            <a href="#features" className="hover:text-indigo-600">{t('features')}</a>
            <a href="#math" className="hover:text-indigo-600">{t('math_focus')}</a>
            <a href="#plr" className="hover:text-indigo-600">{t('resell_rights')}</a>
            <a href="#faq" className="hover:text-indigo-600">{t('faq')}</a>
            <Link to="/login" className="hover:text-indigo-600">{t('admin')}</Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={toggleTheme} className="p-2 hover:bg-[var(--
