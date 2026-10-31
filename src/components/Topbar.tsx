import { Menu, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/store/profileStore";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function Topbar({
  onMenu,
  title,
}: {
  onMenu: () => void;
  title: string;
  role: "admin" | "student";
}) {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const profiles = useProfileStore((s) => s.profiles);

  const stored = currentUser ? profiles[currentUser.id] : undefined;
  const name = stored?.name ?? currentUser?.name ?? "";
  const email = stored?.email ?? currentUser?.email ?? "";
  const avatar = stored?.avatar ?? "";

  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-card/80 backdrop-blur px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="lg:hidden text-foreground">
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggle}>
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l">
          {avatar ? (
            <img src={avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground text-xs font-semibold">
              {initials}
            </div>
          )}
          <div className="text-sm">
            <div className="font-medium leading-tight">{name}</div>
            <div className="text-xs text-muted-foreground leading-tight">{email}</div>
          </div>
        </div>
        <Button variant="ghost" size="icon" aria-label="Sign out" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
