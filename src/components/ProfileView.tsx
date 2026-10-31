import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useProfileStore, useProfileHydrated, type Profile } from "@/store/profileStore";
import { useAuthStore } from "@/store/authStore";
import { Upload } from "lucide-react";

export function ProfileView({ role }: { role: "admin" | "student" }) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const profiles = useProfileStore((s) => s.profiles);
  const ensureProfile = useProfileStore((s) => s.ensureProfile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const hydrated = useProfileHydrated();
  const fileRef = useRef<HTMLInputElement>(null);

  const userId = currentUser?.id ?? "";
  const initial: Profile = {
    name: currentUser?.name ?? "",
    email: currentUser?.email ?? "",
    phone: "",
    department: currentUser?.department ?? "",
    avatar: "",
  };

  useEffect(() => {
    // Only seed after persisted data has been loaded, otherwise the seed
    // can overwrite a saved profile during the hydration window.
    if (hydrated && userId) ensureProfile(userId, initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, userId]);

  const stored = userId ? profiles[userId] : undefined;
  const p = stored ?? initial;

  const [name, setName] = useState(p.name);
  const [email, setEmail] = useState(p.email);
  const [phone, setPhone] = useState(p.phone);
  const [department, setDepartment] = useState(p.department ?? "");
  const [avatar, setAvatar] = useState(p.avatar);

  useEffect(() => {
    setName(p.name);
    setEmail(p.email);
    setPhone(p.phone);
    setDepartment(p.department ?? "");
    setAvatar(p.avatar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stored?.name, stored?.email, stored?.phone, stored?.department, stored?.avatar, userId]);

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please select an image file");
    if (file.size > 2 * 1024 * 1024) return toast.error("Image must be under 2MB");
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    updateProfile(userId, {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      ...(role === "student" ? { department: department.trim() } : {}),
      avatar,
    });
    toast.success("Profile updated");
  };

  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="max-w-2xl">
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            {avatar ? (
              <img src={avatar} alt="Profile avatar" className="h-16 w-16 rounded-full object-cover border" />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground font-semibold">
                {initials}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{name || "—"}</h2>
            <p className="text-sm text-muted-foreground">{email || "—"}</p>
            <div className="mt-2 flex gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                {avatar ? "Change photo" : "Upload photo"}
              </Button>
              {avatar && (
                <Button type="button" size="sm" variant="ghost" onClick={() => setAvatar("")}>
                  Remove
                </Button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickFile} />
            </div>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-2">

            <Label>Full name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          {role === "student" && (
            <div className="grid gap-2">
              <Label>Department</Label>
              <Input value={department} onChange={(e) => setDepartment(e.target.value)} />
            </div>
          )}
          <div className="grid gap-2">
            <Label>Phone</Label>
            <Input placeholder="+92 300 0000000" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <Button type="submit">Save changes</Button>
        </form>
      </Card>
    </div>
  );
}
