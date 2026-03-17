import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // --- Hero Section ---
      "hero_title": "Ignite Their Potential with {{count}}+ Activities",
      "hero_subtitle": "The ultimate digital bundle for Parents, Teachers, and Entrepreneurs.",
      "math_focus": "Math Focus",
      "resell_rights": "Resell Rights",
      "get_access": "Get Access",
      "features": "Features",
      "faq": "FAQ",
      "admin": "Admin",
      "download_now": "Download the Bundle Now",
      "five_star_rated": "5-Star Rated Educational Resource",
      "joined_by": "Joined by 2,500+ educators",

      // --- Main Features ---
      "master_math": "Master Early Math Through Playful Discovery",
      "math_desc": "We believe math shouldn't be a chore. Our 'Math Focus' collection simplifies complex concepts into bite-sized, engaging games.",
      "buy_once": "Buy Once, Sell Forever",
      "plr_desc": "Unlock unrestricted Master Resell Rights (MRR). Launch your own digital product store in minutes.",
      
      // --- Pricing & Checkout ---
      "off": "OFF",
      "original_price": "Original Price",
      "sale_price": "Sale Price",
      "secure_checkout": "Secure Checkout",
      "contact_info": "Contact Information",
      "full_name": "Full Name",
      "email_address": "Email Address",
      "payment_method": "Payment Method",
      "pay_now": "Pay Now",
      "order_summary": "Order Summary",
      "discount": "Discount",
      "total": "Total",
      "lifetime_access": "Lifetime Access",
      "instant_download": "Instant Download",

      // --- Contact Us Page (THE MISSING PART) ---
      "contact_us": "Contact Us",
      "contact_desc": "Have questions? We're here to help you spark genius.",
      "subject": "Subject",
      "message": "Message",
      "send_message": "Send Message",
      "message_sent": "Your message has been sent successfully!",
      "fill_all_fields": "Please fill in all required fields.",

      // --- Footer & Legal ---
      "privacy_policy": "Privacy Policy",
      "terms_service": "Terms of Service",
      "refund_policy": "Refund Policy",
      "rights_reserved": "All rights reserved.",
      "back_to_home": "Back to Home",
      
      // --- Admin Panel ---
      "settings": "Settings",
      "customers": "Customers",
      "overview": "Overview",
      "logout": "Logout",
      "save_changes": "Save Changes",
      "success": "Successful"
    }
  },
  ar: {
    translation: {
      "hero_title": "أشعل إمكاناتهم مع أكثر من {{count}} نشاط",
      "hero_subtitle": "الحزمة الرقمية النهائية للآباء والمعلمين ورواد الأعمال.",
      "math_focus": "التركيز على الرياضيات",
      "resell_rights": "حقوق إعادة البيع",
      "get_access": "احصل على الوصول",
      "features": "المميزات",
      "faq": "الأسئلة الشائعة",
      "download_now": "قم بتنزيل الحزمة الآن",
      "contact_us": "اتصل بنا",
      "contact_desc": "لديك أسئلة؟ نحن هنا لمساعدتك في إشعال العبقرية.",
      "full_name": "الاسم الكامل",
      "email_address": "البريد الإلكتروني",
      "subject": "الموضوع",
      "message": "الرسالة",
      "send_message": "إرسال الرسالة",
      "message_sent": "تم إرسال رسالتك بنجاح!",
      "order_summary": "ملخص الطلب",
      "total": "الإجمالي",
      "pay_now": "ادفع الآن",
      "back_to_home": "العودة إلى الرئيسية"
    }
  },
  fil: {
    translation: {
      "hero_title": "Pukawin ang Kanilang Potensyal sa {{count}}+ na Aktibidad",
      "hero_subtitle": "Ang pinakamahusay na digital bundle para sa mga Magulang at Guro.",
      "contact_us": "Makipag-ugnayan sa Amin",
      "contact_desc": "May mga katanungan? Narito kami para tumulong.",
      "full_name": "Buong Pangalan",
      "email_address": "Email Address",
      "subject": "Paksa",
      "message": "Mensahe",
      "send_message": "Ipadala ang Mensahe",
      "message_sent": "Matagumpay na naipadala ang iyong mensahe!",
      "pay_now": "Magbayad Ngayon",
      "total": "Kabuuan"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
