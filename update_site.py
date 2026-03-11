import os
import google.generativeai as genai
import re

# ربط Gemini
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel('gemini-1.5-flash')

# قراءة ما تريده من الموقع
with open('instructions.txt', 'r', encoding='utf-8') as f:
    instructions = f.read()

# أمر "عسكري" لـ Gemini لمنع الأخطاء نهائياً
prompt = f"""
Build a High-Converting React Landing Page for 'Little Genius Spark' based on: {instructions}.
CRITICAL INSTRUCTIONS:
1. ONLY use standard HTML tags and Tailwind CSS classes.
2. DO NOT use ANY imports except 'react'. (No lucide, No framer-motion, No local files).
3. For icons, use Emojis ONLY (e.g., 🚀, ✅).
4. Include Google Analytics (G-XXXXXXXXXX) code inside a script tag at the top.
5. Provide ONLY the code for LandingPage.tsx.
"""

response = model.generate_content(prompt)
# تنظيف الكود من أي زوائد
clean_code = re.sub(r'```[a-z]*\n?', '', response.text).replace('```', '')

# كتابة الكود وإصلاح الموقع فوراً
with open('src/pages/LandingPage.tsx', 'w', encoding='utf-8') as f:
    f.write(clean_code)
