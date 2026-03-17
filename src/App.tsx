import React, { useState, useRef } from "react";
import { analyzeContent, AnalysisResult } from "./services/geminiService";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Link as LinkIcon,
  Image as ImageIcon,
  FileText,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Info,
  UploadCloud,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./lib/utils";

type TabType = "text" | "link" | "image";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("text");
  const [textInput, setTextInput] = useState("");
  const [linkInput, setLinkInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    setError(null);
    setResult(null);
    setIsAnalyzing(true);

    try {
      let content: string | { data: string; mimeType: string } = "";

      if (activeTab === "text") {
        if (!textInput.trim())
          throw new Error("Please enter some text to analyze.");
        content = textInput;
      } else if (activeTab === "link") {
        if (!linkInput.trim()) throw new Error("Please enter a valid link.");
        content = linkInput;
      } else if (activeTab === "image") {
        if (!imageFile || !imagePreview)
          throw new Error("Please upload an image.");
        const base64Data = imagePreview.split(",")[1];
        content = { data: base64Data, mimeType: imageFile.type };
      }

      const analysisResult = await analyzeContent(activeTab, content);
      setResult(analysisResult);
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "True":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "Mostly True":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "Mixed":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "Mostly False":
        return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "False":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "True":
      case "Mostly True":
        return <ShieldCheck className="w-6 h-6" />;
      case "Mixed":
        return <Info className="w-6 h-6" />;
      case "Mostly False":
      case "False":
        return <ShieldAlert className="w-6 h-6" />;
      default:
        return <Shield className="w-6 h-6" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-indigo-500/30">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl mb-6 border border-indigo-500/20">
            <Shield className="w-10 h-10 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Truth<span className="text-indigo-400">Lens</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl text-lg">
            AI-powered fake news detector. Analyze articles, tweets, links, or
            images for credibility, bias, and factual accuracy.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
              {/* Tabs */}
              <div className="flex p-1 bg-zinc-950 rounded-xl mb-6 border border-zinc-800/50">
                {(["text", "link", "image"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all",
                      activeTab === tab
                        ? "bg-zinc-800 text-white shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50",
                    )}
                  >
                    {tab === "text" && <FileText className="w-4 h-4" />}
                    {tab === "link" && <LinkIcon className="w-4 h-4" />}
                    {tab === "image" && <ImageIcon className="w-4 h-4" />}
                    <span className="capitalize">{tab}</span>
                  </button>
                ))}
              </div>

              {/* Input Areas */}
              <div className="min-h-[200px]">
                <AnimatePresence mode="wait">
                  {activeTab === "text" && (
                    <motion.div
                      key="text"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        Paste text content
                      </label>
                      <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Paste an article, tweet, or claim here..."
                        className="w-full h-48 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 resize-none transition-all"
                      />
                    </motion.div>
                  )}

                  {activeTab === "link" && (
                    <motion.div
                      key="link"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        Article or Post URL
                      </label>
                      <input
                        type="url"
                        value={linkInput}
                        onChange={(e) => setLinkInput(e.target.value)}
                        placeholder="https://example.com/article"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                      />
                    </motion.div>
                  )}

                  {activeTab === "image" && (
                    <motion.div
                      key="image"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        Upload a screenshot or image
                      </label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                          "w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative",
                          imagePreview
                            ? "border-indigo-500/50 bg-indigo-500/5"
                            : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/30",
                        )}
                      >
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <>
                            <UploadCloud className="w-8 h-8 text-zinc-500 mb-3" />
                            <p className="text-sm text-zinc-400">
                              Click to upload image
                            </p>
                            <p className="text-xs text-zinc-600 mt-1">
                              PNG, JPG up to 5MB
                            </p>
                          </>
                        )}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Content...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Analyze Content
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7">
            {isAnalyzing ? (
              <div className="h-full min-h-[400px] bg-zinc-900/30 border border-zinc-800/50 rounded-2xl flex flex-col items-center justify-center p-8 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse" />
                  <Loader2 className="w-12 h-12 text-indigo-400 animate-spin relative z-10" />
                </div>
                <h3 className="text-xl font-medium text-zinc-200 mb-2">
                  Fact-Checking in Progress
                </h3>
                <p className="text-zinc-500 max-w-sm">
                  Our AI is analyzing the content, verifying sources, and
                  cross-referencing claims...
                </p>
              </div>
            ) : result ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm"
              >
                {/* Score Header */}
                <div className="p-8 border-b border-zinc-800 bg-zinc-950/50 flex flex-col md:flex-row items-center gap-8">
                  {/* Circular Score */}
                  <div className="relative flex items-center justify-center shrink-0">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        className="stroke-zinc-800"
                        strokeWidth="12"
                        fill="none"
                      />
                      <motion.circle
                        initial={{ strokeDasharray: "0, 1000" }}
                        animate={{
                          strokeDasharray: `${(result.credibilityScore / 100) * 351.85}, 1000`,
                        }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        cx="64"
                        cy="64"
                        r="56"
                        className={cn(
                          "stroke-current",
                          getScoreColor(result.credibilityScore),
                        )}
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">
                        {result.credibilityScore}
                      </span>
                      <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                        Score
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                      <div
                        className={cn(
                          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-medium text-sm",
                          getVerdictColor(result.verdict),
                        )}
                      >
                        {getVerdictIcon(result.verdict)}
                        {result.verdict}
                      </div>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      This score represents the overall credibility based on NLP
                      analysis, source verification, and factual
                      cross-referencing.
                    </p>
                  </div>
                </div>

                {/* Detailed Analysis */}
                <div className="p-8 space-y-8">
                  <section>
                    <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      Content Analysis
                    </h3>
                    <p className="text-zinc-300 leading-relaxed text-sm bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50">
                      {result.analysis}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-400" />
                      Source Verification
                    </h3>
                    <p className="text-zinc-300 leading-relaxed text-sm bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50">
                      {result.sourceVerification}
                    </p>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {result.redFlags.length > 0 && (
                      <section>
                        <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Red Flags
                        </h3>
                        <ul className="space-y-2">
                          {result.redFlags.map((flag, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm text-zinc-300 bg-red-500/5 border border-red-500/10 p-3 rounded-lg"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                              {flag}
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {result.supportingEvidence.length > 0 && (
                      <section>
                        <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Supporting Evidence
                        </h3>
                        <ul className="space-y-2">
                          {result.supportingEvidence.map((evidence, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm text-zinc-300 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-lg"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                              {evidence}
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[400px] bg-zinc-900/30 border border-zinc-800/50 rounded-2xl flex flex-col items-center justify-center p-8 text-center border-dashed">
                <Shield className="w-16 h-16 text-zinc-800 mb-4" />
                <h3 className="text-xl font-medium text-zinc-400 mb-2">
                  Ready to Analyze
                </h3>
                <p className="text-zinc-600 max-w-sm">
                  Enter text, paste a link, or upload an image on the left to
                  verify its credibility.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
