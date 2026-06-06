# 🧠 MindPilot AI
### *Your Private Student Wellness Cockpit & Mental Health Companion*

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://mind-pilot-ai.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Gemini_AI-1.5_Flash-blue?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

**MindPilot AI** is a privacy-first, local-first wellness dashboard built for students to manage academic pressure, track key wellness signals, spot burnout early, and receive empathetic, non-clinical recommendations.

🔗 **Live Application:** [https://mind-pilot-ai.vercel.app/](https://mind-pilot-ai.vercel.app/)

---

## 🌟 Key Features

*   **📊 Daily Wellness Check-ins:** Log vital indicators such as Mood, Stress, Sleep Hours, Study Hours, Energy Level, and Motivation on interactive sliders, alongside journal entries and upcoming exam dates.
*   **🔒 Privacy-First (Local Storage):** All wellness logs and analyses are saved directly in the browser's `LocalStorage`. No personal logs or identifiers are uploaded or stored on any external databases.
*   **⚡ Gemini AI Journal Analysis:** Powered by `gemini-1.5-flash` to perform natural language processing on daily journal entries. It dynamically identifies emotions, triggers, sentiments, risk levels, and generates personalized, non-clinical supportive recommendations.
*   **🧩 Local Keyword Fallback:** Fully operational offline or without an API key! A fallback keyword engine scans entries for stress signals and high-risk terms to keep the dashboard functional.
*   **🚨 Adaptive Panic Mode:** An immediate, multi-phase grounding sequence and recovery plan (5-minute, 1-hour, 24-hour tasks) adjusted to the user's stress level and current risk factors, with quick-dial access to crisis hotlines (988 and 911).
*   **📈 Trend Charts:** Responsive charts rendered via Recharts visualization library, tracking historical mood, stress, sleep, and study habits over time.

---

## ⚙️ The Mathematical Wellness Engines

MindPilot AI uses custom heuristic models to compute critical student wellness metrics:

### 1. Burnout Risk Engine (`burnoutEngine.js`)
Calculates a percentage risk level (Low, Moderate, High, Critical) based on the running average of your last 7 check-ins:
*   **Stress Penalty:** Adds score if average stress $\ge 6$.
*   **Sleep Deficit:** Adds score if average sleep $< 6.5$ hours (critically high weight if $< 5$ hours).
*   **Study Load:** Penalizes excessive studying ($\ge 7$ hours/day).
*   **Energy & Motivation:** Boosts risk when motivation and energy averages drop below $5/10$.
*   **Exam Proximity:** Adds stress weighting if an exam is within 7 days.

### 2. Exam Readiness Engine (`examReadinessEngine.js`)
Measures exam preparation capacity (out of 100) by combining:
$$\text{Readiness} = \min(30, \text{StudyHours} \times 3.75) + \min(20, \text{Sleep} \times 2.85) + 1.5 \times \text{Energy} + 1.5 \times \text{Motivation} + \text{Mood} - \text{StressPenalty}$$
This ensures that high study load alone cannot make a student "ready" if sleep, energy, or mental state are compromised.

### 3. Mood Forecast Engine (`moodForecastEngine.js`)
Uses a mathematical projection formula combining recent mood trends and pressure factors:
*   **Pressure Index:** Derived from average stress, sleep deficits, study overload, and energy levels.
*   **Decay Coefficients:** Projects mood values for Tomorrow ($0.75$ decay), 3 Days ($0.52$ decay), and 7 Days ($0.34$ decay).
*   **Confidence Scoring:** Computes forecast accuracy confidence based on the quantity of check-in entries and recent mood volatility.

### 4. Recovery Plan Engine (`recoveryPlanEngine.js`)
Dynamically constructs an actionable checklist based on your latest signals:
*   **Critical Risk:** Prompts task reduction and suggests scheduling counselor/advisor chats.
*   **High Stress:** Prescribes a 10-minute slow breathing reset.
*   **Low Sleep:** Highlights sleep protection rules (avoiding late-night studying).
*   **Low Energy:** Advises screen-free micro-breaks.

---

## 🛠️ Technology Stack

*   **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
*   **UI/Styling:** [Tailwind CSS 3](https://tailwindcss.com/) & [Lucide React Icons](https://lucide.dev/)
*   **Data Visualization:** [Recharts](https://recharts.org/)
*   **LLM Integration:** [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) (Gemini 1.5 Flash)
*   **Storage:** LocalStorage (Web Storage API)

---

## 🚀 Getting Started

Follow these steps to run MindPilot AI locally.

### 1. Clone the Repository
```bash
git clone https://github.com/itsamolkumar/MindPilot-AI.git
cd MindPilot-AI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*Note: If no `GEMINI_API_KEY` is provided, the application will automatically fall back to the built-in regex-based analyzer.*

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📂 Project Structure

```text
├── app/
│   ├── api/
│   │   └── analyze/          # Gemini API POST route for journal processing
│   ├── check-in/             # Daily check-in log form page
│   ├── panic/                # Grounding and emergency resources page
│   ├── globals.css           # Custom CSS styles and themes
│   ├── layout.jsx            # Next.js App Shell layout wrapper
│   └── page.jsx              # Main Dashboard and Overview page
├── components/
│   ├── AppShell.jsx          # Sticky Header and navigation bar
│   ├── EmptyState.jsx        # Landing state for new users
│   ├── MetricCard.jsx        # Reusable metric rendering card
│   └── TrendCharts.jsx       # Recharts graphs for historical tracking
├── lib/
│   ├── storage.js            # LocalStorage read/write logic
│   ├── journalFallback.js    # Offline/keyless keyword analyzer
│   ├── burnoutEngine.js      # Burnout assessment heuristics
│   ├── examReadinessEngine.js# Academic preparedness index compiler
│   ├── moodForecastEngine.js # Trend-based future mood forecaster
│   └── recoveryPlanEngine.js # Personalized recovery recommendation builder
├── package.json              # Project dependencies and script runner
└── next.config.mjs           # NextJS configuration settings

---

## 🤝 Contributing

We welcome improvements, tests, and accessibility fixes. Quick start:

1. Fork the repo and create a feature branch.
2. Run tests locally: `npm install` then `npm test`.
3. Keep changes focused and add tests for new behavior.
4. Open a PR describing the change and include screenshots or test output when relevant.

Please avoid committing large build artifacts or the `coverage/lcov-report` directory.
```

---

## 🔒 Privacy & Clinical Disclaimer

*   **Privacy:** MindPilot AI is local-first. We do not store or track any of your check-in parameters on external servers. If you write a journal entry, it is sent securely to the Google Gemini API solely for non-clinical text analysis if an API key is configured.
*   **Disclaimer:** MindPilot AI is a peer/self-support wellness tool and **is not a medical or clinical diagnostic tool**. If you are experiencing high-risk anxiety, severe depression, thoughts of self-harm, or any mental health crisis, please activate **Panic Mode** to contact immediate crisis intervention services or seek help from a qualified medical professional.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
