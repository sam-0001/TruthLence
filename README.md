# TruthLens: AI-Powered Misinformation Detector

<p align="center">
  <img src="img/logo/logo.png" alt="TruthLens Logo" width="120" />
</p>

<p align="center">
  Built with ❤️ by <b>Team CODEMATE</b>
</p>

---

## Overview
TruthLens is a tool built to tackle the growing problem of fake news and misleading content online. It helps users quickly check the credibility of articles, social media posts, and images using AI and real-time data.

The goal is simple: make it easier to understand what’s reliable and what’s not.

---

## Features

### Multi-Format Analysis
Paste text, share a link, or upload an image. TruthLens analyzes all formats and gives a quick credibility check.

### Credibility Score
Each input gets a score from 0 to 100, along with a clear verdict so you can easily judge the content.

### Content Analysis
Detects clickbait, emotional manipulation, logical fallacies, and misleading writing patterns.

### Source Verification
Evaluates the reliability, bias, and reputation of the content source.

### Real-Time Fact Checking
Cross-checks claims using live search results to ensure up-to-date analysis.

### Actionable Insights
Breaks results into:
- **Red Flags** — suspicious or unverified elements  
- **Supporting Evidence** — verified and reliable information  

---

## How It Works
TruthLens processes user input using the Gemini 3.1 Pro model along with real-time search. It compares claims across sources and presents the results in a clean, easy-to-understand dashboard.

---

## Use Cases
- Verifying viral social media posts  
- Fact-checking news and political claims  
- Identifying clickbait content  
- Improving media literacy  

---

## Tech Stack
- **Frontend:** React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons  
- **AI Integration:** @google/genai SDK (Gemini 3.1 Pro with search grounding)  

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/truthlens.git](https://github.com/sam-0001/TruthLence.git

# Navigate into the project
cd truthlens

# Install dependencies
npm install

# Run the development server
npm run dev
