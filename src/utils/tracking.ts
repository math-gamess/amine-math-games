// src/utils/tracking.ts

// دالة عامة لتتبع الأحداث
export const trackEvent = (category?: any, action?: any, label?: any) => {
  console.log("Track Event:", { category, action, label });
};

// دالة لتتبع زيارات الصفحات
export const trackPageView = (url?: string) => {
  console.log("Track Page View:", url);
};

// دالة التهيئة
export const initTracking = () => {
  console.log("Tracking System Ready");
};

// تصدير افتراضي لتجنب أخطاء الاستيراد غير المسمى
const tracking = {
  trackEvent,
  trackPageView,
  initTracking
};

export default tracking;
