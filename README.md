# TruthLens: AI-Powered Misinformation Detector

## Overview
TruthLens is an advanced, AI-driven application designed to combat the spread of fake news, misleading information, and clickbait across the web and social media. By leveraging cutting-edge Natural Language Processing (NLP) and real-time web search grounding, TruthLens analyzes articles, tweets, and images to provide an objective, easy-to-understand credibility assessment.

## Key Features
* **Multi-Modal Analysis:** Seamlessly fact-check information across different formats. Paste plain text, provide a URL to an article, or upload an image (such as a screenshot of a viral social media post or meme).
* **Credibility Scoring:** Receive a definitive 0–100 trust score alongside a clear, color-coded verdict (ranging from "True" to "False").
* **NLP Content Analysis:** The AI engine detects sensationalism, emotional manipulation, logical fallacies, and factual inconsistencies within the writing style.
* **Source Verification:** Automatically evaluates the historical reliability, bias, and reputation of the publishing source.
* **Live Fact-Checking:** Cross-references claims against reliable, up-to-date information using live Google Search integration to ensure the analysis reflects current events.
* **Actionable Insights:** Breaks down the analysis into specific "Red Flags" (suspicious elements or unverified claims) and "Supporting Evidence" (verified facts that back up the content).

## How it Works
Built using Google's **Gemini 3.1 Pro** model, the app processes the user's input and performs a multi-step reasoning process. It reads the content, searches the web for corroborating or conflicting reports, and synthesizes the findings into a comprehensive, modern dashboard built with React and Tailwind CSS.

## Perfect For
* Verifying viral social media posts before sharing them.
* Fact-checking news articles and political claims.
* Identifying clickbait and emotionally manipulative journalism.
* Educating users on media literacy and critical thinking.

## Tech Stack
* **Frontend:** React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons
* **AI Integration:** `@google/genai` SDK (Gemini 3.1 Pro Preview with Google Search Grounding)
