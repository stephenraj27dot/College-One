import { useState, useEffect } from "react";
import { Search, X, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CollegeSearchProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function CollegeSearch({
  value,
  onChange,
  placeholder = "Search by college name, short name (MIT, SSN, PSG, VIT), TNEA code, city...",
}: CollegeSearchProps) {
  const [internalValue, setInternalValue] = useState(value);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    let active = true;
    const fetchSuggestions = async () => {
      if (internalValue.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      setIsSearching(true);
      try {
        // dynamic import so we don't circularly depend if we don't have to,
        // or we just import it at top
        const { getColleges } = await import("@/services/colleges");
        const res = await getColleges({ searchQuery: internalValue, limit: 5 });
        if (active) {
          setSuggestions(res.colleges);
        }
      } catch (err) {
        console.error("Search suggestion error", err);
      } finally {
        if (active) setIsSearching(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [internalValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDropdown(false);
    onChange(internalValue.trim());
  };

  const handleClear = () => {
    setInternalValue("");
    setSuggestions([]);
    onChange("");
  };

  const handleSelectSuggestion = (collegeName: string) => {
    setInternalValue(collegeName);
    setShowDropdown(false);
    onChange(collegeName);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full flex items-center gap-2">
      <div className="relative flex-1 group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#f29a38]" />
        <Input
          type="text"
          value={internalValue}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          onChange={(e) => {
            setInternalValue(e.target.value);
            setShowDropdown(true);
          }}
          placeholder={placeholder}
          className="pl-10 pr-10 h-12 text-xs sm:text-sm bg-white rounded-xl shadow-sm border-slate-200 focus:border-[#f29a38] focus:ring-2 focus:ring-[#f29a38]/20"
          autoComplete="off"
        />
        {internalValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full z-10"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Suggestions Dropdown */}
        {showDropdown && (suggestions.length > 0 || isSearching) && internalValue.length >= 2 && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
            {isSearching && suggestions.length === 0 ? (
              <div className="p-4 text-xs text-slate-500 text-center">Searching...</div>
            ) : (
              <ul className="max-h-64 overflow-y-auto py-2">
                {suggestions.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectSuggestion(c.name)}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none flex flex-col items-start transition-colors"
                    >
                      <span className="text-sm font-semibold text-slate-800 line-clamp-1">{c.name}</span>
                      <span className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="text-blue-600 font-medium">#{c.tnea_code}</span>
                        <span>•</span>
                        <span>{c.city}, {c.district}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      <Button
        type="submit"
        className="h-12 px-6 bg-[#1e233a] hover:bg-[#2d3558] text-white font-bold rounded-xl shadow-md gap-2 shrink-0"
      >
        <Search className="h-4 w-4 text-[#f29a38]" />
        <span className="hidden sm:inline">Search</span>
      </Button>
    </form>
  );
}
