import os
import google.generativeai as genai

# إعداد الاتصال بـ Gemini
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel('gemini-1.5-flash')

# قراءة تعليماتك من ملف instructions.txt
with open('instructions.txt', 'r', encoding='utf-8') as f:
    instructions = f.read()

# أمر صارم للذكاء الاصطناعي لإنتاج كود احترافي "أوتوماتيكي"
prompt = f"""
Write a premium React Landing Page (LandingPage.tsx) based on: {instructions}.
CRITICAL RULES FOR AUTOMATION:
1. NO local imports (No ../utils/tracking).
2. Use ONLY Tailwind CSS for styling and icons (use emojis for icons).
3. Include Google Analytics (G-XXXXXXXXXX) and Google Ads tracking scripts.
4. Return ONLY the code, no markdown backticks.
"""

response = model.generate_content(prompt)
clean_code = response.text.replace("```tsx", "").replace("```jsx", "").replace("```", "")

# تحديث الملف أوتوماتيكياً
with open('src/pages/LandingPage.tsx', 'w', encoding='utf-8') as f:
    f.write(clean_code)
