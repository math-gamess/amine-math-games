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

import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<any>(null);
  const [formStatus, setFormStatus] = React.useState<'idle' | 'sending' | 'success'>('idle');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        // Auto-detection logic (mocked)
        const savedLang = localStorage.getItem('i18nextLng');
        if (!savedLang) {
          // In a real app, you'd call a Geo-IP API here
          // For now, we'll just use the default or detect browser lang
          const browserLang = navigator.language.split('-')[0];
          const supported = ['en', 'ar', 'fr', 'es', 'de'];
          if (supported.includes(browserLang)) {
            i18n.changeLanguage(browserLang);
          }
        }
      })
      .catch(err => {
        console.error('Failed to load settings:', err);
        // Fallback settings to avoid crash
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

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => setFormStatus('success'), 1500);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangMenuOpen(false);
  };

  const isRTL = i18n.language === 'ar';
  const discountPercent = settings ? Math.round(((settings.original_price - settings.sale_price) / settings.original_price) * 100) : 0;

  useEffect(() => {
    if (settings) {
      const injectCode = (code: string, id: string) => {
        if (!code) return;
        // Remove existing if any
        const existing = document.getElementById(id);
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.id = id;
        container.innerHTML = code;
        
        // Execute scripts manually if they are in the code
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
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${adsId}`;
        script1.id = 'google-ads-js';
        
        const script2 = document.createElement('script');
        script2.id = 'google-ads-init';
        script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${adsId}');
        `;
        
        document.head.appendChild(script1);
        document.head.appendChild(script2);
      }
    }
  }, [settings]);

  const triggerPurchaseEvent = () => {
    if (!settings) return;
    const value = parseFloat(settings.sale_price) || 5.0;
    const currency = 'USD';

    // Facebook Purchase
    if (window.fbq) {
      window.fbq('track', 'Purchase', { value, currency });
    }

    // TikTok Purchase
    if (window.ttq) {
      window.ttq.track('CompletePayment', { value, currency });
    }

    // Google Ads Purchase
    if (window.gtag && settings.google_ads_status === 'on' && settings.google_ads_id && settings.google_ads_label) {
      window.gtag('event', 'conversion', {
        'send_to': `${settings.google_ads_id}/${settings.google_ads_label}`,
        'value': value,
        'currency': currency
      });
    }

    // Google Analytics Purchase (if GA4 is loaded via ga_tag or gtag)
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        value: value,
        currency: currency,
        items: [{ item_id: 'bundle_1', item_name: 'Little Genius Spark Bundle' }]
      });
    }
  };

  if (!settings) return null;

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
    { code: 'de', label: 'Deutsch' }
  ];

  const testimonials = [
    {
      name: "Sarah J.",
      role: "Teacher",
      content: t('testimonial_1_content'),
      image: "https://picsum.photos/seed/sarah/100/100"
    },
    {
      name: "David M.",
      role: "Parent",
      content: t('testimonial_2_content'),
      image: "https://picsum.photos/seed/david/100/100"
    },
    {
      name: "Elena R.",
      role: "Entrepreneur",
      content: t('testimonial_3_content'),
      image: "https://picsum.photos/seed/elena/100/100"
    },
    {
      name: "Ahmed K.",
      role: "Educator",
      content: t('testimonial_4_content'),
      image: "https://picsum.photos/seed/ahmed/100/100"
    },
    {
      name: "Jessica L.",
      role: "Mom",
      content: t('testimonial_5_content'),
      image: "https://picsum.photos/seed/jessica/100/100"
    }
  ];

  return (
    <div className={`min-h-screen bg-[var(--bg-main)] font-sans text-[var(--text-main)] selection:bg-indigo-100 selection:text-indigo-900 transition-colors ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* SEO Header / Navigation */}
      <header className="sticky top-0 z-50 bg-[var(--bg-card)]/80 backdrop-blur-md border-b border-[var(--border-color)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden lg:flex gap-8 text-sm font-medium text-[var(--text-muted)]">
            <a href="#features" className="hover:text-indigo-600 transition-colors">{t('features')}</a>
            <a href="#math" className="hover:text-indigo-600 transition-colors">{t('math_focus')}</a>
            <a href="#plr" className="hover:text-indigo-600 transition-colors">{t('resell_rights')}</a>
            <a href="#faq" className="hover:text-indigo-600 transition-colors">{t('faq')}</a>
            <Link to="/login" className="hover:text-indigo-600 transition-colors">{t('admin')}</Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-[var(--border-color)] rounded-full transition-colors text-[var(--text-muted)]"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            
            <div className="relative" ref={langMenuRef}>
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="p-2 hover:bg-[var(--border-color)] rounded-full transition-colors text-[var(--text-muted)]"
                aria-label="Change Language"
              >
                <Globe className="w-5 h-5" />
              </button>
              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute top-full mt-2 w-40 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-xl overflow-hidden z-50 ${isRTL ? 'left-0' : 'right-0'}`}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-indigo-600 hover:text-white transition-colors ${i18n.language === lang.code ? 'bg-indigo-50 text-indigo-600 font-bold' : ''}`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="bg-indigo-600 text-white px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              {t('get_access')}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                <Star className="w-4 h-4 fill-yellow-600" />
                <span>{t('five_star_rated')}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[var(--text-main)] mb-6 leading-[1.1]">
                {t('hero_title', { count: 15000 })}
              </h1>
              <p className="text-xl text-[var(--text-muted)] mb-10 leading-relaxed">
                {t('hero_subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/checkout')}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  {t('download_now')}
                </button>
                <div className="flex items-center justify-center gap-4 px-6 py-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                      <img key={i} src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" className="w-8 h-8 rounded-full border-2 border-[var(--bg-card)]" referrerPolicy="no-referrer" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-[var(--text-muted)]">{t('joined_by')}</span>
                </div>
              </div>
            </motion.div>
          </div>
          {/* Background Decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
            <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-400 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
          </div>
        </section>

        {/* Math Focus Section */}
        <section id="math" className="py-24 bg-[var(--bg-card)] transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight text-[var(--text-main)]">
                  {t('master_math')}
                </h2>
                <p className="text-lg text-[var(--text-muted)] mb-8 leading-relaxed">
                  {t('math_desc')}
                </p>
                <ul className="space-y-4">
                  {[
                    t('math_item_1'),
                    t('math_item_2'),
                    t('math_item_3'),
                    t('math_item_4')
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 bg-emerald-100 p-1 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="font-medium text-[var(--text-muted)]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-8">
                  <div className="bg-[var(--bg-main)] p-6 rounded-3xl border border-[var(--border-color)]">
                    <Calculator className="w-10 h-10 text-indigo-600 mb-4" />
                    <h3 className="font-bold mb-2 text-[var(--text-main)]">{t('math_grid_1_title')}</h3>
                    <p className="text-sm text-[var(--text-muted)]">{t('math_grid_1_desc')}</p>
                  </div>
                  <div className="bg-indigo-600 p-6 rounded-3xl text-white">
                    <BookOpen className="w-10 h-10 mb-4" />
                    <h3 className="font-bold mb-2">{t('math_grid_2_title')}</h3>
                    <p className="text-sm text-indigo-100">{t('math_grid_2_desc')}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-emerald-500 p-6 rounded-3xl text-white">
                    <Calendar className="w-10 h-10 mb-4" />
                    <h3 className="font-bold mb-2">{t('math_grid_3_title')}</h3>
                    <p className="text-sm text-emerald-50/80">{t('math_grid_3_desc')}</p>
                  </div>
                  <div className="bg-[var(--bg-main)] p-6 rounded-3xl border border-[var(--border-color)]">
                    <Zap className="w-10 h-10 text-yellow-500 mb-4" />
                    <h3 className="font-bold mb-2 text-[var(--text-main)]">{t('math_grid_4_title')}</h3>
                    <p className="text-sm text-[var(--text-muted)]">{t('math_grid_4_desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PLR Section */}
        <section id="plr" className="py-24 bg-slate-900 text-white overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">{t('buy_once')}</h2>
              <p className="text-xl text-slate-400">
                {t('plr_desc')}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <TrendingUp className="w-8 h-8" />,
                  title: t('plr_item_1_title'),
                  desc: t('plr_item_1_desc')
                },
                {
                  icon: <ShieldCheck className="w-8 h-8" />,
                  title: t('plr_item_2_title'),
                  desc: t('plr_item_2_desc')
                },
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: t('plr_item_3_title'),
                  desc: t('plr_item_3_desc')
                }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
                  <div className="text-indigo-400 mb-6">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/10 blur-[120px] -z-0" />
        </section>

        {/* Social Proof */}
        <section className="py-24 bg-[var(--bg-main)] transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-16 text-[var(--text-main)]">{t('testimonials_title')}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <Testimonial key={i} name={t.name} role={t.role} content={t.content} image={t.image} />
              ))}
            </div>
          </div>
        </section>

        {/* Pricing / CTA */}
        <section id="pricing" className="py-24 bg-[var(--bg-card)] transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-indigo-600 rounded-[3rem] p-8 md:p-16 text-white text-center relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-bold mb-6">{t('ready_title')}</h2>
                <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                  {t('ready_subtitle')}
                </p>
                <div className="inline-block bg-white text-slate-900 p-8 rounded-3xl shadow-2xl mb-10 relative">
                  {settings.is_discount_active === 'true' && (
                    <div className="absolute -top-4 -right-4 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-black shadow-lg animate-bounce">
                      -{discountPercent}% {t('off')}
                    </div>
                  )}
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">{t('limited_offer')}</p>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    {settings.is_discount_active === 'true' && (
                      <span className="text-2xl text-slate-400 line-through">${settings.original_price}</span>
                    )}
                    <span className="text-6xl font-black text-indigo-600">${settings.sale_price}</span>
                  </div>
                  <button 
                    onClick={() => {
                      triggerPurchaseEvent();
                      navigate('/checkout');
                    }}
                    className="w-full bg-indigo-600 text-white py-4 px-8 rounded-2xl font-bold text-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-6 h-6" />
                    {t('get_access')}
                  </button>
                </div>
                <div className="flex flex-wrap justify-center gap-8 opacity-80">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('secure_checkout')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('stripe_paypal')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('satisfaction_guarantee')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 bg-[var(--bg-main)] transition-colors">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-[var(--text-main)]">{t('faq')}</h2>
            <div className="bg-[var(--bg-card)] rounded-3xl p-8 shadow-sm border border-[var(--border-color)]">
              <FAQItem 
                question={t('faq_q1')} 
                answer={t('faq_a1')} 
              />
              <FAQItem 
                question={t('faq_q2')} 
                answer={t('faq_a2')} 
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--bg-main)] py-12 border-t border-[var(--border-color)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <Logo />
            <div className="flex flex-wrap justify-center gap-8 text-sm text-[var(--text-muted)]">
              <Link to="/privacy" className="hover:text-indigo-600 transition-colors">{t('privacy_policy')}</Link>
              <Link to="/terms" className="hover:text-indigo-600 transition-colors">{t('terms_service')}</Link>
              <Link to="/refund" className="hover:text-indigo-600 transition-colors">{t('refund_policy')}</Link>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              © {new Date().getFullYear()} PLRYO. {t('rights_reserved')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
