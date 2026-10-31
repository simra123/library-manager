import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Outlet, useLocation } from "react-router-dom";

const titles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/books": "Book Management",
  "/admin/categories": "Categories",
  "/admin/students": "Students",
  "/admin/issue": "Issue a Book",
  "/admin/return": "Return a Book",
  "/admin/profile": "Profile",
};

export default function AppLayout({
  role,
}: {
  role: "admin" | "student";
}) {
  const [open, setOpen] = useState(false);

  const { pathname } = useLocation();

  const title = titles[pathname] ?? "";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar role={role} open={open} onClose={() => setOpen(false)} />

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Topbar
          role={role}
          title={title}
          onMenu={() => setOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}