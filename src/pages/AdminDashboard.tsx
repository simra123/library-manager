import {BookOpen,Tags,Users,ArrowRightLeft,RotateCcw,Activity,} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { useLibraryStore } from "@/store/libraryStore";

export default function AdminDashboard() {
  const books = useLibraryStore((s) => s.books);
  const categories = useLibraryStore((s) => s.categories);
  const students = useLibraryStore((s) => s.students);
  const issued = useLibraryStore((s) => s.issued);
  const activities = useLibraryStore((s) => s.activities);

  const issuedCount = issued.filter((i) => i.status === "issued").length;
  const returnedCount = issued.filter((i) => i.status === "returned").length;
  const lowStock = books.filter((b) => b.available <= 1);

  return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome back 👋
          </h2>

          <p className="text-muted-foreground">
            Here's what's happening in your library today.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard
            label="Total Books"
            value={books.length}
            icon={BookOpen}
            accent="primary"
          />

          <StatCard
            label="Categories"
            value={categories.length}
            icon={Tags}
            accent="success"
          />

          <StatCard
            label="Students"
            value={students.length}
            icon={Users}
            accent="primary"
          />

          <StatCard
            label="Issued"
            value={issuedCount}
            icon={ArrowRightLeft}
            accent="warning"
          />

          <StatCard
            label="Returned"
            value={returnedCount}
            icon={RotateCcw}
            accent="success"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Recent Activity</h3>
            </div>

            {activities.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No activity yet.
              </p>
            ) : (
              <ul className="divide-y">
                {activities.slice(0, 8).map((a) => (
                  <li
                    key={a.id}
                    className="py-3 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="text-sm font-medium">
                        {a.action}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        {a.detail}
                      </div>
                    </div>

                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {a.time}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">
              Low Availability
            </h3>

            {lowStock.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                All books in stock.
              </p>
            ) : (
              <ul className="space-y-3">
                {lowStock.map((b) => (
                  <li
                    key={b.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-medium truncate">
                        {b.title}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {b.author}
                      </div>
                    </div>

                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        b.available === 0
                          ? "bg-destructive/10 text-destructive"
                          : "bg-warning/15 text-warning-foreground"
                      }`}
                    >
                      {b.available === 0
                        ? "Out of stock"
                        : `${b.available} left`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
  );
}