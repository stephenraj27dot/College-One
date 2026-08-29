import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { SearchX, Home, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="py-24 flex items-center justify-center bg-slate-50 min-h-[70vh]">
      <Container size="sm">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 text-center space-y-5 shadow-lg">
          <div className="h-16 w-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <SearchX className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Page or Institution Not Found
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              The Tamil Nadu college profile or academic URL you are seeking does not exist or may have been relocated.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/colleges" className="w-full sm:w-auto">
              <Button variant="primary" size="md" className="w-full font-bold gap-2 bg-blue-600 hover:bg-blue-700">
                <span>Browse All Colleges</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" size="md" className="w-full font-semibold gap-2">
                <Home className="h-4 w-4" />
                <span>Return Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
