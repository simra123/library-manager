import { BookOpen, Clock, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/StatCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/EmptyState";
import { useLibraryStore } from "@/store/libraryStore";
import { useAuthStore } from "@/store/authStore";
import { formatDate } from "@/utils/date";

export default function StudentDashboard() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const issued = useLibraryStore((s) => s.issued);
  const items = currentUser
    ? issued.filter((i) => i.studentId === currentUser.id)
    : [];

  const active = items.filter((i) => i.status === "issued");
  const returned = items.filter((i) => i.status === "returned");
  const firstName = (currentUser?.name ?? "").split(" ")[0] || "there";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Hi, {firstName} 👋
        </h2>
        <p className="text-muted-foreground">
          Here are the books you've borrowed.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Currently Borrowed"
          value={active.length}
          icon={BookOpen}
          accent="primary"
        />
        <StatCard
          label="Due Soon"
          value={active.length}
          icon={Clock}
          accent="warning"
        />
        <StatCard
          label="Returned"
          value={returned.length}
          icon={CheckCircle2}
          accent="success"
        />
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold">My Borrowed Books</h3>
        </div>

        {items.length === 0 ? (
          <EmptyState
            title="No borrowed books"
            description="Visit the library to check out a book."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book ID</TableHead>
                <TableHead>Book</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {items.map((i) => {
                const overdue =
                  i.status === "issued" &&
                  new Date(i.dueDate) < new Date();

                return (
                  <TableRow key={i.id}>
                    <TableCell className="font-mono text-xs">
                      {i.bookId}
                    </TableCell>

                    <TableCell className="font-medium">
                      {i.bookTitle}
                    </TableCell>

                    <TableCell>{formatDate(i.issueDate)}</TableCell>

                    <TableCell>{formatDate(i.dueDate)}</TableCell>

                    <TableCell>
                      {i.status === "returned" ? (
                        <Badge className="bg-success text-success-foreground">
                          Returned
                        </Badge>
                      ) : overdue ? (
                        <Badge variant="destructive">
                          Overdue
                        </Badge>
                      ) : (
                        <Badge className="bg-warning text-warning-foreground">
                          Borrowed
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}