import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Library } from "lucide-react";
import { Card } from "@/components/ui/card";

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-6">
          <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
            <Library className="h-5 w-5" />
          </div>
          <span className="font-semibold text-lg">LibraryHub</span>
        </Link>
        <Card className="p-8 shadow-xl">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </Card>
        {footer && <div className="mt-4 text-center text-sm text-muted-foreground">{footer}</div>}
      </div>
    </div>
  );
}
