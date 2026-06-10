import { NavLink, Link } from "react-router-dom";
import { BarChart3, Bookmark, FlaskConical, Gauge, Home, Map, Search, Settings, Sparkles, UserRound } from "lucide-react";

const links = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/skills", label: "Skills", icon: UserRound },
  { to: "/analyze", label: "Analyze", icon: Search },
  { to: "/problems", label: "Problems", icon: BarChart3 },
  { to: "/learning-path", label: "Path", icon: Map },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/accuracy", label: "Accuracy", icon: FlaskConical },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/home" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md border border-aqua/35 bg-aqua/10 text-sm font-black text-aqua shadow-glow">
            PF
          </span>
          <span className="hidden font-display text-lg font-black text-white sm:inline">ProblemFit</span>
        </Link>
        <div className="thin-scrollbar flex max-w-full items-center gap-1 overflow-x-auto rounded-md border border-white/10 bg-white/[0.03] p-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-sm transition ${
                  isActive ? "bg-aqua/15 text-aqua" : "text-slate-300 hover:bg-white/[0.08] hover:text-white"
                }`
              }
              title={label}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden lg:inline">{label}</span>
            </NavLink>
          ))}
        </div>
        <Link
          to="/analyze"
          className="hidden rounded-md bg-aqua px-4 py-2 text-sm font-bold text-ink shadow-glow transition hover:bg-mint md:inline-flex"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Analyze
        </Link>
      </nav>
    </header>
  );
}
