// ... (نفس الـ imports السابقة)

export default function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | 'paysera'>('stripe');
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        
        // التحقق من أن الاستجابة ناجحة ومن نوع JSON
        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid API response");
        }

        const data = await res.json();
        setSettings(data);
      } catch (err) {
        console.error("Settings Load Error:", err);
        // قيم افتراضية لضمان عمل الصفحة في حال فشل الـ API
        setSettings({
          original_price: 197,
          sale_price: 5,
          paypal_client_id: "" // أضف معرف الـ Paypal الخاص بك هنا كاحتياط
        });
      } finally {
        setLoading(false); // سيتم إيقاف التحميل في كل الحالات (نجاح أو فشل)
      }
    };

    fetchSettings();
  }, []);

  // دالة حساب الخصم مع حماية ضد القيم الفارغة
  const calculateDiscount = () => {
    if (!settings || !settings.original_price) return 0;
    return Math.round(((settings.original_price - settings.sale_price) / settings.original_price) * 100);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  // بقية الكود (الـ return) يبقى كما هو مع التأكد من استخدام ()calculateDiscount
  // ...
