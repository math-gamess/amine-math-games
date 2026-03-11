import os
import google.generativeai as genai
import re

# إعداد Gemini
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel('gemini-1.5-flash')

# قراءة تعليماتك
with open('instructions.txt', 'r', encoding='utf-8') as f:
    instructions = f.read()

# طلب كود "نظيف" لا يسبب أخطاء Vercel
prompt = f"""
Rewrite the React component 'src/pages/LandingPage.tsx' based on: {instructions}.
CRITICAL RULES:
1. DO NOT import local files (No '../utils/tracking', No '../components/Logo').
2. Use ONLY Tailwind CSS.
3. Add this Google Analytics tag: G-XXXXXXXXXX.
4. Return ONLY the code, no text before or after.
"""

response = model.generate_content(prompt)
content = response.text

# تنظيف الكود من أي علامات Markdown
clean_code = re.sub(r'```[a-z]*\n?', '', content).replace('```', '')

# كتابة الملف أوتوماتيكياً
with open('src/pages/LandingPage.tsx', 'w', encoding='utf-8') as f:
    f.write(clean_code)
