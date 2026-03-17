// 1. تعديل دالة تتبع الشراء لتكون آمنة ولا تعطل الموقع
const triggerPurchaseEvent = () => {
  if (!settings) return;
  const value = parseFloat(settings.sale_price) || 5.0;
  const currency = 'USD';

  try {
    // Facebook آمن
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', { value, currency });
    }

    // TikTok آمن
    if (typeof window !== 'undefined' && (window as any).ttq) {
      (window as any).ttq.track('CompletePayment', { value, currency });
    }

    // Google Ads آمن
    if (typeof window !== 'undefined' && (window as any).gtag && settings.google_ads_id && settings.google_ads_label) {
      (window as any).gtag('event', 'conversion', {
        'send_to': `${settings.google_ads_id}/${settings.google_ads_label}`,
        'value': value,
        'currency': currency
      });
    }
  } catch (err) {
    console.error("Tracking error, but continuing...", err);
  }
};

// 2. تحديث طريقة حساب الخصم لتجنب NaN
const discountPercent = settings 
  ? Math.round(((parseFloat(settings.original_price) - parseFloat(settings.sale_price)) / parseFloat(settings.original_price)) * 100) 
  : 0;

// 3. تحديث زر الـ CTA لضمان الانتقال حتى لو فشل التتبع
<button 
  onClick={() => { 
    triggerPurchaseEvent(); // ننفذ التتبع أولاً
    trackEvent('begin_checkout'); 
    setTimeout(() => navigate('/checkout'), 100); // تأخير بسيط لضمان إرسال البيانات ثم الانتقال
  }}
  className="bg-indigo-600 text-white px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
>
  {t('get_access')}
</button>
