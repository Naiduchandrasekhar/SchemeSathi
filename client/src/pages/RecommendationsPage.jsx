import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Share2,
  FileText,
  CheckCircle,
  TrendingUp,
  Inbox,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Toast from "../components/Toast";

// Animated circle dial for match scores
const ScoreDial = ({ score }) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const duration = 700; // ms
    const stepTime = Math.max(Math.floor(duration / Math.max(score, 1)), 8);
    let start = 0;
    
    const timer = setInterval(() => {
      start += 1;
      if (start > score) {
        clearInterval(timer);
      } else {
        setPercent(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const radius = 22;
  const strokeWidth = 4.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex h-14 w-14 items-center justify-center shrink-0 shadow-sm rounded-full bg-bg-primary/50">
      <svg className="h-14 w-14 -rotate-90">
        <circle
          cx="28"
          cy="28"
          r={radius}
          strokeWidth={strokeWidth}
          className="stroke-brand-primary/10 fill-none"
        />
        <motion.circle
          cx="28"
          cy="28"
          r={radius}
          strokeWidth={strokeWidth}
          className="stroke-brand-primary fill-none"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ ease: "easeOut", duration: 0.4 }}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-xs font-bold text-brand-primary">
        {percent}%
      </span>
    </div>
  );
};

export default function RecommendationsPage() {
  const { state } = useLocation();
  const schemes = state?.schemes || [];
  const profile = state?.profile || {};
  const [toast, setToast] = useState(null);

  // Bookmark hooks loaded from localstorage
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("savedSchemes") || "[]");
    } catch {
      return [];
    }
  });

  const toggleBookmark = (schemeName) => {
    let updated;
    if (bookmarks.includes(schemeName)) {
      updated = bookmarks.filter((x) => x !== schemeName);
      setToast({
        message: "Removed scheme from bookmarks.",
        type: "info",
      });
    } else {
      updated = [...bookmarks, schemeName];
      setToast({
        message: "Saved scheme to bookmarks! 🌟",
        type: "success",
      });
    }
    setBookmarks(updated);
    localStorage.setItem("savedSchemes", JSON.stringify(updated));
  };

  const handleShare = (schemeName, officialLink) => {
    const text = `I qualified for the "${schemeName}" scheme on SchemeSathi! Check your eligibility here or apply directly: ${officialLink}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setToast({
        message: "Copied share information to clipboard!",
        type: "success",
      });
    } else {
      setToast({
        message: "Clipboard access failed. Copy link manually.",
        type: "error",
      });
    }
  };

  return (
    <main className="min-h-screen bg-bg-primary text-text-main transition-colors duration-300 relative overflow-hidden">
      {/* Background grids */}
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40 dark:opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] radial-glow pointer-events-none" />

      <Header showBack={true} />

      <section className="relative mx-auto max-w-6xl px-6 py-14 z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-main pb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-saffron">
              Personalized Results
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight leading-[1.2] md:text-4xl text-text-main">
              Your matching schemes
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              Matching algorithms matched your details for{" "}
              <span className="font-bold text-brand-primary">{profile.state || "your state"}</span>.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-bg-secondary p-3 border border-border-main text-xs font-semibold text-text-muted shadow-sm select-none">
            <TrendingUp size={14} className="text-brand-primary" />
            <span>Rules-based Eligibility Engine Active</span>
          </div>
        </div>

        {schemes.length ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {schemes.map((s, i) => (
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                key={s.scheme}
                className="flex flex-col justify-between rounded-3xl border border-border-main bg-bg-secondary p-6 shadow-md shadow-black/[0.01] hover:shadow-lg hover:shadow-black/[0.02] hover:border-brand-primary/30 transition-all duration-200"
              >
                <div>
                  {/* Scheme header card block */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="inline-flex items-center rounded-md bg-brand-bg px-2 py-0.5 text-2xs font-bold uppercase tracking-wide text-brand-primary border border-brand-primary/10 select-none">
                        Eligibility Match
                      </span>
                      <h2 className="text-lg font-bold leading-snug tracking-tight text-text-main">
                        {s.scheme}
                      </h2>
                    </div>
                    <ScoreDial score={s.eligibility_score} />
                  </div>

                  {/* Why you're eligible section */}
                  <section className="mt-5 border-t border-border-main pt-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-dim flex items-center gap-1.5 select-none">
                      <CheckCircle size={13} className="text-emerald-500" />
                      Why you're eligible
                    </h3>
                    <ul className="mt-2.5 space-y-1.5 text-xs font-semibold text-text-muted">
                      {s.reason.map((x) => (
                        <li key={x} className="flex items-start gap-2 leading-relaxed">
                          <ChevronRight size={13} className="text-brand-primary shrink-0 mt-0.5" />
                          <span>{x}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Grid details for Benefits & Documents */}
                  <section className="mt-5 grid gap-3 rounded-2xl bg-bg-primary/50 p-4 border border-border-main sm:grid-cols-2">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-text-dim mb-2 select-none">
                        Benefits
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {s.benefits.map((b) => (
                          <span
                            key={b}
                            className="inline-flex items-center rounded-md bg-emerald-500/5 px-2 py-1 text-2xs font-bold text-emerald-600 border border-emerald-500/10 dark:bg-emerald-500/10 dark:text-emerald-400"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-text-dim mb-2 flex items-center gap-1 select-none">
                        <FileText size={12.5} />
                        Documents
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {s.documents.map((d) => (
                          <span
                            key={d}
                            className="inline-flex items-center rounded-md bg-brand-primary/5 px-2 py-1 text-2xs font-bold text-brand-primary border border-brand-primary/10"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </section>

                  {s.application_process && (
                    <div className="mt-4 rounded-xl bg-saffron-light/10 p-3.5 border border-saffron/10">
                      <p className="text-xs leading-relaxed text-text-muted">
                        <span className="font-bold text-saffron uppercase tracking-wide text-2xs block mb-0.5 select-none">
                          Application process
                        </span>
                        {s.application_process}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer action buttons */}
                <div className="mt-6 flex items-center justify-between border-t border-border-main pt-4 gap-2">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={s.official_link}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-primary/10 hover:bg-brand-hover transition duration-200 cursor-pointer"
                  >
                    <span>Apply now</span>
                    <ExternalLink size={13.5} />
                  </a>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleBookmark(s.scheme)}
                      className={`rounded-xl border p-2.5 transition duration-200 cursor-pointer ${
                        bookmarks.includes(s.scheme)
                          ? "border-brand-primary bg-brand-bg text-brand-primary"
                          : "border-border-main hover:bg-bg-tertiary text-text-muted hover:text-text-main"
                      }`}
                      aria-label="Save scheme"
                    >
                      {bookmarks.includes(s.scheme) ? (
                        <BookmarkCheck size={16} />
                      ) : (
                        <Bookmark size={16} />
                      )}
                    </button>

                    <button
                      onClick={() => handleShare(s.scheme, s.official_link)}
                      className="rounded-xl border border-border-main p-2.5 text-text-muted hover:bg-bg-tertiary hover:text-text-main transition duration-200 cursor-pointer"
                      aria-label="Share scheme"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 rounded-3xl bg-bg-secondary p-12 text-center border border-border-main shadow-md max-w-xl mx-auto"
          >
            <div className="inline-grid h-16 w-16 place-items-center rounded-2xl bg-bg-tertiary text-text-muted mb-6">
              <Inbox size={28} />
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              No matching schemes found
            </h2>
            <p className="mt-3 text-sm text-text-muted max-w-sm mx-auto leading-relaxed">
              Based on your age, state, or income, our rules-based matching engines
              didn't find custom matching guidelines.
            </p>
            <Link
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-3 text-xs font-bold text-white shadow-md shadow-brand-primary/10 hover:bg-brand-hover transition duration-200 cursor-pointer"
              to="/"
            >
              <ArrowLeft size={14} />
              <span>Modify Details</span>
            </Link>
          </motion.div>
        )}
      </section>

      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
