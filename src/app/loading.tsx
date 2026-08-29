import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="py-32 flex flex-col items-center justify-center space-y-3 bg-slate-50 min-h-[60vh]">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      <span className="text-xs font-semibold text-slate-500 tracking-wide">
        Loading Tamil Nadu Academic Data...
      </span>
    </div>
  );
}
