import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between pt-4">
      <div className="text-sm text-muted-foreground">Page {page} of {totalPages}</div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft className="h-4 w-4" /> Prev
        </Button>
        <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
