import os
import google.generativeai as genai

# إعداد الاتصال
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel('gemini-1.5-flash')

# قراءة التعليمات
with open("instructions.txt", "r", encoding="utf-8") as f:
    user_instructions = f.read()

# طلب الكود من Gemini
prompt = f"Update 'src/pages/LandingPage.tsx' with these instructions: {user_instructions}. Use Tailwind CSS. Return ONLY the code without markdown blocks."

response = model.generate_content(prompt)

# حفظ الكود الجديد
with open("src/pages/LandingPage.tsx", "w", encoding="utf-8") as f:
    f.write(response.text)

print("✅ Site Updated!")
