import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatedIntro } from "../components/AnimatedIntro";

export const ONBOARDING_KEY = "problemfit_onboarding_complete";

export function OnboardingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem(ONBOARDING_KEY)) {
      navigate("/analyze", { replace: true });
    }
  }, [navigate]);

  const complete = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    navigate("/skills", { replace: true });
  };

  return <AnimatedIntro forceShow onComplete={complete} />;
}
