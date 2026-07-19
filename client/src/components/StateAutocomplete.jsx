import { useState, useRef, useEffect } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StateAutocomplete({
  states,
  value,
  onChange,
  error,
  placeholder = "Search and select state",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  // Sync internal search query with form value
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  const filteredStates = states.filter((state) =>
    state.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    // Reset highlights when filters change
    setHighlightedIndex(0);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        // Reset query back to value if they didn't select anything
        setQuery(value || "");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  const selectState = (state) => {
    onChange(state);
    setQuery(state);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          filteredStates.length > 0 ? (prev + 1) % filteredStates.length : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          filteredStates.length > 0
            ? (prev - 1 + filteredStates.length) % filteredStates.length
            : 0
        );
        break;
      case "Enter":
        e.preventDefault();
        if (filteredStates.length > 0) {
          selectState(filteredStates[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setQuery(value || "");
        break;
      default:
        break;
    }
  };

  // Scroll highlighted item into view if needed
  useEffect(() => {
    if (isOpen && listRef.current) {
      const activeEl = listRef.current.children[highlightedIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isOpen]);

  return (
    <div className="relative mt-2" ref={containerRef}>
      <div className="relative">
        <MapPin className="absolute left-3.5 top-3.5 h-5 w-5 text-text-dim" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-bg-secondary py-3 pl-11 pr-10 text-text-main shadow-sm outline-none transition duration-200 placeholder:text-text-dim focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 ${
            error ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-border-main focus:border-brand-primary"
          }`}
        />
        <ChevronDown
          size={18}
          className={`absolute right-3.5 top-4 cursor-pointer text-text-dim transition-transform duration-200 ${
            isOpen ? "rotate-180 text-brand-primary" : ""
          }`}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-40 mt-2 w-full overflow-hidden rounded-xl border border-border-main bg-bg-secondary shadow-xl max-h-60"
          >
            <ul
              ref={listRef}
              className="max-h-60 overflow-y-auto py-1 no-scrollbar"
              role="listbox"
            >
              {filteredStates.length > 0 ? (
                filteredStates.map((state, idx) => (
                  <li
                    key={state}
                    role="option"
                    aria-selected={idx === highlightedIndex}
                    onClick={() => selectState(state)}
                    className={`flex cursor-pointer items-center px-4 py-2.5 text-sm font-medium transition-colors ${
                      idx === highlightedIndex
                        ? "bg-brand-bg text-brand-primary"
                        : "text-text-muted hover:bg-bg-tertiary hover:text-text-main"
                    } ${value === state ? "font-bold text-brand-primary" : ""}`}
                  >
                    {state}
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-sm text-text-dim italic text-center">
                  No states found
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
