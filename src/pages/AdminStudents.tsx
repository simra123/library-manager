import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmModal } from "@/components/ConfirmModal";
import { EmptyState } from "@/components/EmptyState";
import { Pagination } from "@/components/Pagination";
import { useLibraryStore, type Student } from "@/store/libraryStore";
import {
  createStudent,
  deleteStudent,
  getStudents,
} from "@/services/studentService";

const PAGE_SIZE = 8;

export default function StudentsPage() {
  const items = useLibraryStore((s) => s.students);
  const setStudents = useLibraryStore((s) => s.setStudents);
  const addStudent = useLibraryStore((s) => s.addStudent);
  const updateStudent = useLibraryStore((s) => s.updateStudent);
  const removeStudent = useLibraryStore((s) => s.deleteStudent);

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [toDelete, setToDelete] = useState<Student | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadStudents = async () => {
      try {
        const students = await getStudents();
        if (active) setStudents(students);
      } catch (error) {
        if (active) {
          setStudents([]);
          toast.error(
            error instanceof Error ? error.message : "Could not load students",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadStudents();

    return () => {
      active = false;
    };
  }, [setStudents]);

  const filtered = useMemo(
    () =>
      items.filter(
        (s) =>
          !q ||
          s.name.toLowerCase().includes(q.toLowerCase()) ||
          s.email.toLowerCase().includes(q.toLowerCase()) ||
          s.id.toLowerCase().includes(q.toLowerCase()),
      ),
    [items, q],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const values = {
      name: String(f.get("name")).trim(),
      email: String(f.get("email")).trim(),
      department: String(f.get("department")).trim(),
      password: String(f.get("password")).trim(),
    };

    if (editing) {
      updateStudent(editing.id, values);
      toast.success("Student updated");
      setOpen(false);
      setEditing(null);
      return;
    }

    setSubmitting(true);
    try {
      const student = await createStudent(values);
      addStudent(student);
      toast.success("Student added");
      setOpen(false);
      setEditing(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not add student",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Card className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              className="pl-9"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Dialog
            open={open}
            onOpenChange={(o) => {
              setOpen(o);
              if (!o) setEditing(null);
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-1 h-4 w-4" /> Add Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editing ? "Edit Student" : "Add Student"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={onSubmit} className="space-y-4">
                {editing && (
                  <div className="grid gap-2">
                    <Label>Student ID</Label>
                    <Input value={editing.id} disabled />
                  </div>
                )}
                <div className="grid gap-2">
                  <Label>Name</Label>
                  <Input name="name" defaultValue={editing?.name} required />
                </div>
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    name="email"
                    defaultValue={editing?.email}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Department</Label>
                  <Input
                    name="department"
                    defaultValue={editing?.department}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    name="password"
                    required
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Adding..." : editing ? "Save" : "Add"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </Card>

        <Card className="p-0 overflow-hidden">
          {loading ? (
            <EmptyState title="Loading students..." />
          ) : pageItems.length === 0 ? (
            <EmptyState title="No students found" />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageItems.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-xs">
                        {s.id}
                      </TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.email}</TableCell>
                      <TableCell>{s.department}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditing(s);
                              setOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setToDelete(s)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-4 border-t">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </Card>

        <ConfirmModal
          open={!!toDelete}
          onOpenChange={(o) => !o && setToDelete(null)}
          title="Remove student?"
          description={`${toDelete?.name} will be removed from the system.`}
          onConfirm={async () => {
            if (!toDelete) return;
            const student = toDelete;

            try {
              await deleteStudent(student.id);
              removeStudent(student.id);
              toast.success("Student removed");
              setToDelete(null);
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : "Could not remove student",
              );
            }
          }}
        />
      </div>
    </div>
  );
}
