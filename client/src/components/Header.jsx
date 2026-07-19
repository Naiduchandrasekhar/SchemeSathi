import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Sun, Moon, ArrowLeft } from "lucide-react";

export default function Header({ showBack }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border-main bg-bg-secondary/80 backdrop-blur-md transition-colors duration-300">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {showBack ? (
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm font-bold text-brand-primary transition hover:text-brand-hover"
          >
            <ArrowLeft
              size={18}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            <span>New search</span>
          </Link>
        ) : (
          <Link to="/" className="flex items-center gap-2.5 font-bold text-text-main text-lg tracking-tight select-none">
            <motion.span
              whileHover={{ rotate: 15, scale: 1.05 }}
              className="grid h-9 w-9 place-items-center rounded-xl bg-brand-primary text-white shadow-md shadow-brand-primary/20"
            >
              <Sparkles size={17} />
            </motion.span>
            <span>
              Scheme<span className="text-brand-primary">Sathi</span>
            </span>
          </Link>
        )}

        <div className="flex items-center gap-4">
          {!showBack && (
            <span className="hidden text-xs font-semibold uppercase tracking-wider text-text-muted sm:block">
              Government schemes, made simple
            </span>
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="relative grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-border-main bg-bg-secondary text-text-muted shadow-sm transition hover:bg-bg-tertiary hover:text-text-main"
            aria-label="Toggle dark mode"
          >
            <AnimatePresence mode="wait">
              {theme === "light" ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Sun size={18} />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Moon size={18} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>
    </header>
  );
}
