# ⚡ FlowLedger

**The Enterprise Workflow ROI & Efficiency Audit Platform.**

FlowLedger is a powerful internal tool designed for operational leaders to map, analyze, and optimize business processes. By combining rule-based logic with Gemini 1.5 Flash AI, FlowLedger identifies operational bottlenecks, calculates the real-world cost of manual waste, and generates actionable automation roadmaps.

## 🚀 Key Features

-   **Intelligent Workflow Mapping**: Visualize complex multi-departmental processes using interactive React Flow canvases.
-   **AI-Powered Efficiency Audit**: Automatically detect approval delays, manual repetition, and duplicate work using the Gemini 1.5 Flash engine.
-   **Dynamic ROI Calculator**: Simulate potential savings by adjusting hourly rates and team efficiency gains in real-time.
-   **Automation Backlog**: Prioritized recommendations (P0-P3) categorized by effort and impact.
-   **Actionable Roadmaps**: Interactive multi-phase implementation plans with checklists and timelines.
-   **Zero-Backend Demo**: Fully functional "Demo Mode" using LocalStorage persistence—ready for instant presentation.

## 🛠 Tech Stack

-   **Framework**: Next.js 15+ (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS 4.0 + Shadcn/UI
-   **Animations**: Framer Motion
-   **Visualization**: Recharts & @xyflow/react (React Flow)
-   **AI Engine**: Google Gemini 1.5 Flash API

## 🏁 Getting Started

### 1. Prerequisites
- Node.js 20+
- A Google Gemini API Key (Optional, fallback engine provided)

### 2. Installation
```bash
git clone <your-repo-url>
cd flowledger
npm install
```

### 3. Configuration
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

## 💡 How to Demo

1.  **Load Demo Data**: Click the "Load Demo Data" button in the header to populate the system with 5 realistic operational scenarios.
2.  **Explore the Dashboard**: View the aggregated waste across departments and the potential $1M+ in quick-win savings.
3.  **Run an Audit**: Go to "Workflows", select "Monthly Financial Closing", and click "Run Efficiency Audit". Watch the AI analyze the process in real-time.
4.  **Visualize the Map**: Check the "Workflow Map" to see highlighted red edges where bottlenecks occur.
5.  **Build a Plan**: From the analysis results, click "Build Action Plan" to see the step-by-step roadmap for improvement.

---

Built with ❤️ by Mihika Singh during Internal Tools Hacks.
