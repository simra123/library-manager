import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function StatCard({
  label, value, icon: Icon, accent = "primary",
}: { label: string; value: string | number; icon: LucideIcon; accent?: "primary" | "success" | "warning" | "destructive" }) {
  const bg =
    accent === "success" ? "bg-success/10 text-success" :
    accent === "warning" ? "bg-warning/15 text-warning-foreground" :
    accent === "destructive" ? "bg-destructive/10 text-destructive" :
    "bg-primary/10 text-primary";
  return (
    <Card className="p-5 flex items-center justify-between border-border">
      <div>
        <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">{label}</div>
        <div className="mt-2 text-3xl font-bold tracking-tight">{value}</div>
      </div>
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${bg}`}>
        <Icon className="h-6 w-6" />
      </div>
    </Card>
  );
}
