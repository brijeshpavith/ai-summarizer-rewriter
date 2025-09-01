````markdown
# ✨ AI Summarizer & Rewriter

A web app that allows users to **summarize or rewrite text** with AI.  
Built with **React + Vite + TailwindCSS v4 + Netlify Functions + OpenAI GPT-4o-mini**.  

👉 **Live Demo:** (add Netlify link here once deployed)  

---

## 📖 Overview
Unlike a content generator, this tool helps users transform **existing text**.  
You can paste in long passages (articles, reports, essays) and instantly get:  

- Summaries (Short, Medium, Long)  
- Rewrites (Casual, Professional, Simplified)  

This project showcases **frontend polish, backend integration, and prompt engineering** for AI-powered productivity tools.

---

## ✨ Features
- 📝 **Paste text** into a left panel, results shown on right panel (split-screen UI)  
- 🔄 **Two modes**:  
  - **Summarize** → Short (~80 words), Medium (~200 words), Long (~400 words)  
  - **Rewrite** → Casual, Professional, Simplified tone  
- 📋 **Export options** → Copy with feedback or Download as `.txt`  
- ⏳ **Loading spinner** overlay during processing  
- 🎨 **Polished UI** with gradient header, rounded panels, responsive design  
- 📜 **Graceful errors** (e.g., API key missing, network issues)  
- 📱 **Responsive** → works on mobile and desktop  

---

## 🛠 Tech Stack
- **Frontend:** React (Vite), TailwindCSS v4  
- **Backend:** Netlify Functions (Node.js)  
- **AI Model:** OpenAI GPT-4o-mini  
- **Deployment:** Netlify  

---

## 🚀 Running Locally

### ✅ Prerequisites
- [Node.js](https://nodejs.org/) (v18+)  
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (`npm install -g netlify-cli`)  
- OpenAI API key from [platform.openai.com](https://platform.openai.com/)  

---

### 🔹 Steps
1. Clone the repo:
   ```bash
   git clone https://github.com/<your-username>/ai-summarizer-rewriter.git
   cd ai-summarizer-rewriter
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Add your API key:
   Create `.env` file in root:

   ```
   OPENAI_API_KEY=sk-xxxxx
   ```

4. Run locally with Netlify:

   ```bash
   netlify dev
   ```

   * App runs at → [http://localhost:8888](http://localhost:8888)
   * Function runs at → [http://localhost:8888/.netlify/functions/process](http://localhost:8888/.netlify/functions/process)

5. Paste text, choose Summarize/Rewrite → process with AI.

---

## 📦 Deployment

Deployed on **Netlify** with:

* Build command: `npm run build`
* Publish directory: `dist`
* Env variable: `OPENAI_API_KEY`

---

## 📸 Screenshots

(Add screenshots: input panel, output panel, copy/download, mobile view)

---

## 🔮 Future Enhancements

* Add **URL input** (fetch articles directly from a link)
* Multi-language summarization & rewriting
* Export as `.pdf` in addition to `.txt`
* Inline editor for live rewriting
* Dark mode toggle

---

## 👨‍💻 Author

Built with ❤️ by **Brijesh P. (HumAIne)**

* 🌐 Demo: (Netlify link here)
* 💼 [LinkedIn](https://www.linkedin.com/)

````

---