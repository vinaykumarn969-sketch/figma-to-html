# Figma to HTML/CSS Converter (AI-Powered)

This project automatically converts a **Figma design file** into a **fully functional HTML + CSS layout** using **OPENAI_API** (Generative AI).  
It helps developers quickly turn design mockups into working front-end code.

---

# Overview

# What It Does
- Reads the **raw JSON** of a Figma design (`figma_raw.json`)
- Sends the JSON to **OPENAI_API**
- AI generates **semantic HTML and modern CSS**
- Saves results as `index.html` and `style.css`
- Opens the generated webpage automatically in your browser

# Use Case
Perfect for:
- Frontend engineers automating design-to-code
- Design-to-development workflow demos
- Quick prototyping and hackathons

---

# Prerequisites
- **Node.js v18+** installed  
- A **Google Gemini API key**  
  → Get it here: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

---

# Clone or Open the Project
```bash
git clone https://github.com/hridhykk/figma-to-html.git
cd figma-to-html


