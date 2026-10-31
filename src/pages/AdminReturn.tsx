import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/EmptyState";
import { useLibraryStore } from "@/store/libraryStore";
import { formatDate } from "@/utils/date";


export default function ReturnPage() {
  const items = useLibraryStore((s) => s.issued);
  const returnBookAction = useLibraryStore((s) => s.returnBook);

  const doReturn = (id: string) => {
    returnBookAction(id);
    toast.success("Book returned");
  };

  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-4 border-b"><h3 className="font-semibold">Issued Books</h3></div>
      {items.length === 0 ? <EmptyState title="Nothing issued yet" />
        : (
          <Table>
            <TableHeader><TableRow>
              <TableHead>Book ID</TableHead><TableHead>Book</TableHead>
              <TableHead>Student ID</TableHead><TableHead>Student</TableHead>
              <TableHead>Issue Date</TableHead><TableHead>Due Date</TableHead>
              <TableHead>Return Date</TableHead><TableHead>Status</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {items.map((i) => {
                const overdue = i.status === "issued" && new Date(i.dueDate) < new Date();
                return (
                  <TableRow key={i.id}>
                    <TableCell className="font-mono text-xs">{i.bookId}</TableCell>
                    <TableCell className="font-medium">{i.bookTitle}</TableCell>
                    <TableCell className="font-mono text-xs">{i.studentId}</TableCell>
                    <TableCell>{i.studentName}</TableCell>
                    <TableCell>{formatDate(i.issueDate)}</TableCell>
                    <TableCell>{formatDate(i.dueDate)}</TableCell>
                    <TableCell>{formatDate(i.returnDate)}</TableCell>
                    <TableCell>
                      {i.status === "returned"
                        ? <Badge className="bg-success text-success-foreground">Returned</Badge>
                        : overdue ? <Badge variant="destructive">Overdue</Badge>
                        : <Badge className="bg-warning text-warning-foreground">Issued</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      {i.status === "issued" && <Button size="sm" onClick={() => doReturn(i.id)}>Return</Button>}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
    </Card>
  );
}
