import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DataPaginationProps {
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
}

export function DataPagination({
  page,
  totalPages,
  onPage,
}: DataPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-2 py-3 border-t border-border/40">
      <p className="text-xs text-muted-foreground">
        Page <span className="font-medium">{page}</span> of{" "}
        <span className="font-medium">{totalPages}</span>
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0 rounded-lg"
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>

        {/* Page number buttons */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .reduce<(number | "...")[]>((acc, p, i, arr) => {
            if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
            acc.push(p);
            return acc;
          }, [])
          .map((p, i) =>
            p === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="px-1 text-xs text-muted-foreground"
              >
                …
              </span>
            ) : (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="sm"
                className="h-7 w-7 p-0 rounded-lg text-xs"
                onClick={() => onPage(p as number)}
              >
                {p}
              </Button>
            ),
          )}

        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0 rounded-lg"
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
