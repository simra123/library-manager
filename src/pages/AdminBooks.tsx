import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ConfirmModal } from "@/components/ConfirmModal";
import { EmptyState } from "@/components/EmptyState";
import { Pagination } from "@/components/Pagination";
import { useLibraryStore, type Book } from "@/store/libraryStore";


const PAGE_SIZE = 6;

function AdminBooks() {
  const books = useLibraryStore((s) => s.books);
  const cats = useLibraryStore((s) => s.categories);
  const addBook = useLibraryStore((s) => s.addBook);
  const updateBook = useLibraryStore((s) => s.updateBook);
  const deleteBook = useLibraryStore((s) => s.deleteBook);

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [toDelete, setToDelete] = useState<Book | null>(null);

  const filtered = useMemo(() => {
    return books.filter((b) => {
      const matchQ = !q || b.title.toLowerCase().includes(q.toLowerCase()) || b.author.toLowerCase().includes(q.toLowerCase()) || b.id.toLowerCase().includes(q.toLowerCase());
      const matchC = filter === "all" || b.category === filter;
      return matchQ && matchC;
    });
  }, [books, q, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const payload: Book = {
      id: String(f.get("id")).trim(),
      title: String(f.get("title")),
      author: String(f.get("author")),
      category: String(f.get("category")),
      quantity: Number(f.get("quantity")),
      available: Number(f.get("available")),
    };
    if (editing) {
      updateBook(editing.id, payload);
      toast.success("Book updated");
    } else {
      if (books.some((b) => b.id.toLowerCase() === payload.id.toLowerCase())) {
        toast.error("Book ID already exists"); return;
      }
      addBook(payload);
      toast.success("Book added");
    }
    setDialogOpen(false); setEditing(null);
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    deleteBook(toDelete.id);
    toast.success("Book deleted");
    setToDelete(null);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by title, author, ID..." className="pl-9" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
          </div>
          <Select value={filter} onValueChange={(v) => { setFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-56"><SelectValue placeholder="Filter by category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {cats.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-1 h-4 w-4" /> Add Book</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit Book" : "Add Book"}</DialogTitle></DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label>Book ID</Label>
                <Input name="id" defaultValue={editing?.id} placeholder="e.g. B009" required disabled={!!editing} />
              </div>
              <div className="grid gap-2"><Label>Title</Label><Input name="title" defaultValue={editing?.title} required /></div>
              <div className="grid gap-2"><Label>Author</Label><Input name="author" defaultValue={editing?.author} required /></div>
              <div className="grid gap-2">
                <Label>Category</Label>
                <select
                  name="category"
                  defaultValue={editing?.category ?? cats[0]?.name ?? ""}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  {cats.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2"><Label>Quantity</Label><Input type="number" name="quantity" min={0} defaultValue={editing?.quantity ?? 1} required /></div>
                <div className="grid gap-2"><Label>Available</Label><Input type="number" name="available" min={0} defaultValue={editing?.available ?? 1} required /></div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editing ? "Save changes" : "Add book"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b"><h3 className="font-semibold">All Books <span className="text-muted-foreground font-normal">({filtered.length})</span></h3></div>
        {pageItems.length === 0 ? (
          <EmptyState title="No books found" description="Try adjusting your search or add a new book." />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead><TableHead>Title</TableHead><TableHead>Author</TableHead>
                  <TableHead>Category</TableHead><TableHead>Qty</TableHead><TableHead>Status</TableHead><TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-mono text-xs">{b.id}</TableCell>
                    <TableCell className="font-medium">{b.title}</TableCell>
                    <TableCell>{b.author}</TableCell>
                    <TableCell><Badge variant="secondary">{b.category}</Badge></TableCell>
                    <TableCell>{b.available}/{b.quantity}</TableCell>
                    <TableCell>
                      {b.available === 0 ? <Badge variant="destructive">Unavailable</Badge>
                        : b.available <= 1 ? <Badge className="bg-warning text-warning-foreground">Low</Badge>
                        : <Badge className="bg-success text-success-foreground">Available</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setEditing(b); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => setToDelete(b)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-4 border-t"><Pagination page={page} totalPages={totalPages} onPageChange={setPage} /></div>
          </>
        )}
      </Card>

      <ConfirmModal
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete this book?"
        description={`"${toDelete?.title}" will be permanently removed from the catalog.`}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default AdminBooks;
