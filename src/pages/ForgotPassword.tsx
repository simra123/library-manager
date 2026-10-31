import { Link } from "react-router-dom";
import { toast } from "sonner";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword } from "@/services/authService";


export default function Forgot() {
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await forgotPassword({ email: String(f.get("email")) });
    toast.success("If the account exists, a reset link has been sent.");
  };
  return (
    <AuthShell
      title="Reset password"
      subtitle="Enter your email and we'll send a reset link"
      footer={<Link to="/" className="text-primary hover:underline">Back to home</Link>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <Button type="submit" className="w-full">Send reset link</Button>
      </form>
    </AuthShell>
  );
}
