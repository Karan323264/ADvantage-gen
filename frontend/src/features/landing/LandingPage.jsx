import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import PublicHeader from "../../components/layout/Header";
import PromptInput from "../generator/PromptInput";
import SignupForm from "../auth/SignUpForm.jsx";
import LoginForm from "../auth/LoginForm";
import AnimatedBackground from "../../components/ui/AnimatedBackground.jsx";

function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState(null);

  const [demoStage, setDemoStage] = useState("idle");
  const [currentDemo, setCurrentDemo] = useState(null);
  const [typedText, setTypedText] = useState("");
  const [typedExplanation, setTypedExplanation] = useState("");
  const [explanationDone, setExplanationDone] = useState(false);
  const explanationRef = useRef(null);

  const fullHeadline = `Generate AI-Powered
Social Media Campaigns`;

  const [introText, setIntroText] = useState("");
  const [introDone, setIntroDone] = useState(false);

  const typingRef = useRef(null);
  const stageRef = useRef(null);

  const demoPrompts = [
    {
      prompt: "Launch eco-friendly coffee brand campaign",
      caption: "Sustainability meets flavor. Make every sip count.",
      explanation:
        "AdVantage Gen creates high-clarity visuals, AI-optimized captions, and platform-ready hashtags — structured for measurable growth and brand consistency.",
      hashtags: ["#EcoBrand", "#SustainableLiving", "#CoffeeCulture"],
      image:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80"
    },
    {
      prompt: "AI SaaS for HR automation launch",
      caption: "Transform your hiring with AI precision.",
      explanation:
        "From creative direction to campaign-ready assets, AdVantage Gen parallel-generates imagery, persuasive copy, and engagement-optimized tags in seconds.",
      hashtags: ["#AIRecruitment", "#HRTech", "#FutureOfWork"],
      image:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop&q=80"
    },
    {
      prompt: "Luxury skincare Instagram campaign",
      caption: "Radiance redefined for modern elegance.",
      explanation:
        "Craft premium campaign creatives with intelligent prompt enhancement, brand voice tuning, and structured output tailored for modern social performance.",
      hashtags: ["#LuxuryBeauty", "#SkincareRoutine", "#GlowUp"],
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80"
    }
  ];

  /* INTRO TYPING */
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setIntroText(fullHeadline.slice(0, i + 1));
      i++;
      if (i === fullHeadline.length) {
        clearInterval(interval);
        setTimeout(() => setIntroDone(true), 900);
      }
    }, 70);

    return () => clearInterval(interval);
  }, []);

  /* START DEMO AFTER INTRO */
  useEffect(() => {
    if (!introDone) return;
    if (isAuthenticated) return;

    const timer = setTimeout(() => {
      const random =
        demoPrompts[Math.floor(Math.random() * demoPrompts.length)];
      setCurrentDemo(random);
      setDemoStage("typing");
    }, 1200);

    return () => clearTimeout(timer);
  }, [isAuthenticated, introDone]);

  /* PROMPT TYPING */
  useEffect(() => {
    if (demoStage !== "typing" || !currentDemo) return;

    let index = 0;
    setTypedText("");

    typingRef.current = setInterval(() => {
      setTypedText(currentDemo.prompt.slice(0, index + 1));
      index++;

      if (index === currentDemo.prompt.length) {
        clearInterval(typingRef.current);
        setTimeout(() => setDemoStage("send"), 1000);
      }
    }, 90);

    return () => clearInterval(typingRef.current);
  }, [demoStage, currentDemo]);

  /* STAGE FLOW */
  useEffect(() => {
    if (demoStage === "send") {
      stageRef.current = setTimeout(() => {
        setDemoStage("loading");
      }, 800);
    }

    if (demoStage === "loading") {
      stageRef.current = setTimeout(() => {
        setDemoStage("result");
      }, 2000);
    }

    return () => clearTimeout(stageRef.current);
  }, [demoStage]);

  useEffect(() => {
    if (demoStage !== "result" || !currentDemo) return;

    let index = 0;
    setTypedExplanation("");
    setExplanationDone(false);

    explanationRef.current = setInterval(() => {
      setTypedExplanation(
        currentDemo.explanation.slice(0, index + 1)
      );
      index++;

      if (index === currentDemo.explanation.length) {
        clearInterval(explanationRef.current);
        setExplanationDone(true);
      }
    }, 35);

    return () => clearInterval(explanationRef.current);
  }, [demoStage, currentDemo]);

  /* LOOP CONTINUES */
  useEffect(() => {
    if (!explanationDone) return;

    const timer = setTimeout(() => {
      const random =
        demoPrompts[Math.floor(Math.random() * demoPrompts.length)];

      setCurrentDemo(random);
      setTypedText("");
      setTypedExplanation("");
      setExplanationDone(false);
      setDemoStage("typing");
    }, 1500);

    return () => clearTimeout(timer);
  }, [explanationDone]);

  return (
    <div className="relative h-screen overflow-hidden flex flex-col">

      <AnimatedBackground />
      <div className="absolute inset-0 grid-background pointer-events-none z-10"></div>
      <div className="absolute inset-0 center-glow pointer-events-none z-10"></div>

      <div className="relative z-20 flex flex-col h-full">

        <PublicHeader
          openLogin={() => setAuthMode("login")}
          openSignup={() => setAuthMode("signup")}
        />

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-5xl">

            <div className="relative h-[460px] overflow-visible">

              {/* HERO */}
              <div
                className={`absolute inset-0 flex flex-col justify-center items-center text-center
                ${
                  !introDone
                    ? "animate-hero-intro"
                    : demoStage === "loading" || demoStage === "result"
                    ? "animate-hero-exit"
                    : "animate-fadeIn"
                }`}
              >
                <h1 className="text-6xl font-semibold leading-tight text-slate-900 whitespace-pre-line">
                {!introDone ? (
                  <>
                    {(() => {
                      if (!introText.includes("AI")) {
                        return introText;
                      }

                      const before = introText.split("AI")[0];
                      const after = introText.slice(before.length + 2);

                      return (
                        <>
                          {before}
                          <span className="ai-gradient">AI</span>
                          {after}
                        </>
                      );
                    })()}
                    <span className="type-cursor"></span>
                  </>
                ) : (
                  <>
                    Generate{" "}
                    <span className="ai-gradient">AI</span>
                    -Powered{"\n"}
                    Social Media Campaigns
                  </>
                )}
              </h1>

                <p className="text-base text-slate-500 mt-4">
                  Structured creativity powered by AI.
                </p>
              </div>

              {/* OUTPUT + RIGHT SIDE */}
              {(demoStage === "loading" || demoStage === "result") && (
                <div className="absolute inset-0 flex justify-start items-start gap-20 animate-output-enter">

                  {/* LEFT CARD */}
                  <div className="w-[420px] mt-20">

                    {demoStage === "loading" && (
                      <div className="bg-white rounded-xl shadow-xl p-7">
                        <div className="h-52 bg-slate-200 rounded-lg animate-pulse mb-5" />
                        <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse mb-2" />
                        <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse" />
                      </div>
                    )}

                    {demoStage === "result" && currentDemo && (
                      <div className="bg-white rounded-xl shadow-xl p-7">
                        <img
                          src={currentDemo.image}
                          alt="Generated"
                          className="w-full h-52 object-cover rounded-lg mb-5"
                        />
                        <p className="text-base font-semibold text-slate-900">
                          {currentDemo.caption}
                        </p>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {currentDemo.hashtags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-slate-100 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                {/* RIGHT SIDE PANEL */}
                {demoStage === "result" && currentDemo && (
                  <div className="w-[420px] mt-24 animate-fadeIn">
                    <h3 className="text-5xl font-semibold text-slate-900 mb-4">
                      Why AdVantage{" "}
                      <span className="ai-gradient">Gen</span>?
                    </h3>

                    <p className="text-slate-600 leading-relaxed text-base">
                      {typedExplanation}
                      <span className="type-cursor small"></span>
                    </p>
                  </div>
                )}

                </div>
              )}

            </div>

            <div className="space-y-5 mt-16">
              <PromptInput
                value={typedText}
                readOnly
                highlightSend={demoStage === "send"}
                loading={demoStage === "loading"}
              />
            </div>

          </div>
        </div>

      </div>

      {authMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-md">
          <div className="relative w-full max-w-md mx-4 animate-fadeIn">
            <button
              onClick={() => setAuthMode(null)}
              className="absolute -top-10 right-0 text-sm text-slate-700"
            >
              Close
            </button>

            {authMode === "login" ? (
              <LoginForm switchToSignup={() => setAuthMode("signup")} />
            ) : (
              <SignupForm switchToLogin={() => setAuthMode("login")} />
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default LandingPage;