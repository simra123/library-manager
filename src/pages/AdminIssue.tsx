import { useState } from "react";
import { toast } from "sonner";
import { ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLibraryStore } from "@/store/libraryStore";
import { today, addDays } from "@/utils/date";

export default function IssuePage() {
  const students = useLibraryStore((s) => s.students);
  const books = useLibraryStore((s) => s.books);
  const issueBookAction = useLibraryStore((s) => s.issueBook);

  const [studentId, setStudentId] = useState("");
  const [bookId, setBookId] = useState("");
  const [issueDate, setIssueDate] = useState(today());
  const [dueDate, setDueDate] = useState(addDays(today(), 14));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !bookId) { toast.error("Select a student and a book"); return; }
    const student = students.find((s) => s.id === studentId)!;
    const book = books.find((b) => b.id === bookId)!;
    if (book.available <= 0) { toast.error("Book unavailable"); return; }
    issueBookAction({ studentId, studentName: student.name, bookId, bookTitle: book.title, issueDate, dueDate });
    toast.success(`Issued "${book.title}" to ${student.name}`);
    setStudentId(""); setBookId("");
  };

  return (
    <div className="max-w-2xl">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><ArrowRightLeft className="h-5 w-5" /></div>
          <div>
            <h2 className="text-lg font-semibold">Issue a book</h2>
            <p className="text-sm text-muted-foreground">Select a student and available book</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-2">
            <Label>Student</Label>
            <Select value={studentId} onValueChange={setStudentId}>
              <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
              <SelectContent>{students.map((s) => <SelectItem key={s.id} value={s.id}>{s.name} ({s.id})</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Book</Label>
            <Select value={bookId} onValueChange={setBookId}>
              <SelectTrigger><SelectValue placeholder="Select book" /></SelectTrigger>
              <SelectContent>
                {books.map((b) => (
                  <SelectItem key={b.id} value={b.id} disabled={b.available === 0}>
                    {b.title} ({b.id}) {b.available === 0 ? "· Unavailable" : `· ${b.available} left`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2"><Label>Issue date</Label><Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} /></div>
            <div className="grid gap-2"><Label>Due date</Label><Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></div>
          </div>
          <Button type="submit" className="w-full">Issue Book</Button>
        </form>
      </Card>
    </div>
  );
}
