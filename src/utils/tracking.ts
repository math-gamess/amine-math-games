// src/utils/tracking.ts

// 1. دالة حفظ بارامترات الرابط (التي كانت تسبب الخطأ)
export const saveUrlParams = () => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const utmParams: Record<string, string> = {};
    
    params.forEach((value, key) => {
      if (key.startsWith('utm_') || key === 'fbclid' || key === 'gclid') {
        utmParams[key] = value;
      }
    });

    if (Object.keys(utmParams).length > 0) {
      localStorage.setItem('landing_utm_params', JSON.stringify(utmParams));
      console.log('UTM Params saved:', utmParams);
    }
  }
};

// 2. دالة تتبع الأحداث
export const trackEvent = (eventName: string, eventParams?: any) => {
  console.log(`Event Tracked: ${eventName}`, eventParams);
  
  // إرسال لـ Google Analytics إذا كان مفعلاً
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
  }
};

// 3. دالة تهيئة التتبع (اختياري)
export const initTracking = () => {
  console.log("Tracking initialized");
};

// تصدير افتراضي لضمان التوافق
const tracking = {
  saveUrlParams,
  trackEvent,
  initTracking
};

export default tracking;
