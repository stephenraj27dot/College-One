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

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(internalValue.trim());
  };

  const handleClear = () => {
    setInternalValue("");
    onChange("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#f29a38]" />
        <Input
          type="text"
          value={internalValue}
          onChange={(e) => setInternalValue(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10 h-12 text-xs sm:text-sm bg-white rounded-xl shadow-sm border-slate-200 focus:border-[#f29a38] focus:ring-2 focus:ring-[#f29a38]/20"
        />
        {internalValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button
        type="submit"
        className="h-12 px-6 bg-[#1e233a] hover:bg-[#2d3558] text-white font-bold rounded-xl shadow-md gap-2"
      >
        <Search className="h-4 w-4 text-[#f29a38]" />
        <span>Search</span>
      </Button>
    </form>
  );
}
