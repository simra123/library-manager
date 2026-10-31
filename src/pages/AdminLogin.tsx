import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAdmin } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";



export default function AdminLogin() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const { user, token } = await loginAdmin({
        email: String(form.get("email")),
        password: String(form.get("password")),
      });
      setSession(user, token);
      toast.success("Welcome back, Admin");
      navigate("/admin", { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Admin Login"
      subtitle="Sign in to manage the library"
      footer={<>Not an admin? <Link to="/login/student" className="text-primary hover:underline">Student login</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot?</Link>
          </div>
          <Input id="password" name="password" type="password" required autoComplete="current-password" />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}
