import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-8 text-sm text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p>ProblemFit demo mode runs without paid APIs, scraping, or protected problem statements.</p>
        <div className="flex gap-4">
          <Link to="/about" className="hover:text-aqua">
            About
          </Link>
          <Link to="/accuracy" className="hover:text-aqua">
            Accuracy Lab
          </Link>
        </div>
      </div>
    </footer>
  );
}
