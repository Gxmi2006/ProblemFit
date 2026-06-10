import { Route, Routes } from "react-router-dom";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { AnimatedIntro } from "./components/AnimatedIntro";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { ScrollToTop } from "./components/ScrollToTop";
import { AboutPage } from "./pages/AboutPage";
import { AccuracyLabPage } from "./pages/AccuracyLabPage";
import { AnalysisResultPage } from "./pages/AnalysisResultPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LandingPage } from "./pages/LandingPage";
import { LearningPathPage } from "./pages/LearningPathPage";
import { ProblemAnalyzerPage } from "./pages/ProblemAnalyzerPage";
import { ProblemsPage } from "./pages/ProblemsPage";
import { SavedProblemsPage } from "./pages/SavedProblemsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { SkillProfilePage } from "./pages/SkillProfilePage";

export default function App() {
  return (
    <>
      <AnimatedBackground />
      <AnimatedIntro />
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/skills" element={<SkillProfilePage />} />
        <Route path="/analyze" element={<ProblemAnalyzerPage />} />
        <Route path="/result" element={<AnalysisResultPage />} />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/learning-path" element={<LearningPathPage />} />
        <Route path="/saved" element={<SavedProblemsPage />} />
        <Route path="/accuracy" element={<AccuracyLabPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      <Footer />
    </>
  );
}
