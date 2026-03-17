// src/utils/tracking.ts
export const trackEvent = (category: string, action: string, label?: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }
};

export const initGA = (id: string) => {
  // كود تهيئة جوجل أناليتكس إذا كنت تستخدمه
};
