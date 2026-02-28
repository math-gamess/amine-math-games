import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Zap,
  Menu,
  X,
  Globe,
  Sun,
  Moon,
  Code,
  CreditCard
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

import { useTheme } from '../context/ThemeContext';

export default function DashboardLayout() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    // Login requirement disabled for now as per user request
    /*
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/login');
    }
    */
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  const navItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: t('overview'), path: '/dashboard' },
    { icon: <Users className="w-5 h-5" />, label: t('customers'), path: '/dashboard/customers' },
    { icon: <TrendingUp className="w-5 h-5" />, label: t('sales_reports'), path: '/dashboard/reports' },
    { icon: <Code className="w-5 h-5" />, label: t('tracking_codes'), path: '/dashboard/tracking' },
    { icon: <CreditCard className="w-5 h-5" />, label: t('payment_settings'), path: '/dashboard/payments' },
    { icon: <Settings className="w-5 h-5" />, label: t('settings'), path: '/dashboard/settings' },
  ];

  const [isLangMenuOpen, setIsLangMenuOpen] = React.useState(false);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
    { code: 'de', label: 'Deutsch' }
  ];

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 flex ${isRTL ? 'rtl' : 'ltr'} transition-colors duration-300`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col w-64 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-xl ${isRTL ? 'border-l' : 'border-r'}`}>
        <div className="p-6 flex items-center justify-between">
          <Logo />
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>

        <div className="px-4 mb-4">
          <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all border border-indigo-100 dark:border-indigo-900/30"
          >
            <Globe className="w-4 h-4" />
            <span>{t('view_site')}</span>
          </a>
        </div>

        <nav className="flex-grow px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <div className="relative">
            <button 
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-white transition-all"
            >
              <Globe className="w-5 h-5" />
              <span className="font-medium">{languages.find(l => l.code === i18n.language)?.label || 'Language'}</span>
            </button>
            <AnimatePresence>
              {isLangMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-full mb-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden z-50"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-indigo-600 hover:text-white transition-colors ${i18n.language === lang.code ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-indigo-500" />
          <span className="font-bold text-slate-900 dark:text-white">{t('genius_admin')}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-slate-950 pt-20 p-6">
          <nav className="space-y-4">
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-indigo-600/10 text-indigo-400 font-bold border border-indigo-500/20"
            >
              <Globe className="w-5 h-5" />
              {t('view_site')}
            </a>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-4 rounded-2xl transition-all ${
                  location.pathname === item.path 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-900 text-slate-400'
                }`}
              >
                {item.icon}
                <span className="font-bold">{item.label}</span>
              </Link>
            ))}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl bg-red-500/10 text-red-400 font-bold"
            >
              <LogOut className="w-5 h-5" />
              {t('logout')}
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow pt-20 lg:pt-0 overflow-auto">
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
