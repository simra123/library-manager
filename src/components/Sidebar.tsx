import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, BookOpen, Tags, Users, ArrowRightLeft, RotateCcw,
  User, LogOut, Library, X,
} from "lucide-react";

const adminItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/books", label: "Books", icon: BookOpen },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/issue", label: "Issue Book", icon: ArrowRightLeft },
  { to: "/admin/return", label: "Return Book", icon: RotateCcw },
  { to: "/admin/profile", label: "Profile", icon: User },
];

const studentItems = [
  { to: "/student", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/student/profile", label: "Profile", icon: User },
];

export function Sidebar({ role, open, onClose }: { role: "admin" | "student"; open: boolean; onClose: () => void }) {
  const items = role === "admin" ? adminItems : studentItems;
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-5 border-b border-sidebar-border">
          <Link to={role === "admin" ? "/admin" : "/student"} className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Library className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">LibraryHub</div>
              <div className="text-xs text-sidebar-foreground/60 capitalize">{role} panel</div>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden text-sidebar-foreground/70">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {items.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Link>
        </div>
      </aside>
    </>
  );
}
