
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";

// @ts-expect-error api.js does not currently have a TypeScript declaration.
import api from "../services/api";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

import { Badge } from "@/components/ui/badge";
import { ConfirmModal } from "@/components/ConfirmModal";
import { EmptyState } from "@/components/EmptyState";
import { Pagination } from "@/components/Pagination";

const PAGE_SIZE = 6;

interface Category {
  id: number;
  name: string;
}

interface Book {
  id: number;
  title: string;
  author: string;
  category_id: number;
  category: string;
  quantity: number;
  available: number;
}

interface ApiBook {
  Id: number;
  Title: string;
  Author: string | null;
  CategoryId: number;
  CategoryName: string | null;
  Quantity: number;
  Available: number;
}

interface ApiCategory {
  Id: number;
  Name: string;
  Description: string | null;
}

function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [cats, setCats] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [toDelete, setToDelete] = useState<Book | null>(null);

  // Convert backend book response into frontend format
  const mapBook = (b: ApiBook): Book => ({
    id: b.Id,
    title: b.Title,
    author: b.Author || "",
    category_id: b.CategoryId,
    category:
      b.CategoryName ||
      cats.find((c) => c.id === b.CategoryId)?.name ||
      "Uncategorized",
    quantity: Number(b.Quantity),
    available: Number(b.Available),
  });

  // GET: Fetch books and categories
  const fetchData = async () => {
    try {
      setLoading(true);

      const [bookResponse, categoryResponse] = await Promise.all([
        api.get("/books"),
        api.get("/categories"),
      ]);

      const categoryList: Category[] =
        categoryResponse.data.categories.map((c: ApiCategory) => ({
          id: c.Id,
          name: c.Name,
        }));

      setCats(categoryList);

      const bookList: Book[] = bookResponse.data.books.map(
        (b: ApiBook) => ({
          id: b.Id,
          title: b.Title,
          author: b.Author || "",
          category_id: b.CategoryId,
          category:
            b.CategoryName ||
            categoryList.find((c) => c.id === b.CategoryId)?.name ||
            "Uncategorized",
          quantity: Number(b.Quantity),
          available: Number(b.Available),
        })
      );

      setBooks(bookList);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load books"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Search and category filter
  const filtered = useMemo(() => {
    return books.filter((b) => {
      const matchQ =
        !q ||
        b.title.toLowerCase().includes(q.toLowerCase()) ||
        b.author.toLowerCase().includes(q.toLowerCase()) ||
        String(b.id).toLowerCase().includes(q.toLowerCase());

      const matchC =
        filter === "all" || String(b.category_id) === filter;

      return matchQ && matchC;
    });
  }, [books, q, filter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const pageItems = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // POST / PUT: Add or update book
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const f = new FormData(e.currentTarget);

    const payload = {
      title: String(f.get("title")).trim(),
      author: String(f.get("author")).trim(),
      category_id: Number(f.get("category")),
      quantity: Number(f.get("quantity")),
      available: Number(f.get("available")),
    };

    if (payload.available > payload.quantity) {
      toast.error("Available quantity cannot exceed total quantity");
      return;
    }

    if (!Number.isInteger(payload.category_id) || payload.category_id <= 0) {
      toast.error("Please select a valid category");
      return;
    }

    try {
      setSaving(true);

      if (editing) {
        // PUT: Update existing book
        await api.put(`/books/${editing.id}`, payload);

        toast.success("Book updated");
      } else {
        // POST: Create new book
        await api.post("/books", payload);

        toast.success("Book added");
      }

      setDialogOpen(false);
      setEditing(null);

      await fetchData();

    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  // DELETE: Delete book
  const confirmDelete = async () => {
    if (!toDelete) return;

    try {
      await api.delete(`/books/${toDelete.id}`);

      setBooks((prev) =>
        prev.filter((b) => b.id !== toDelete.id)
      );

      toast.success("Book deleted");
      setToDelete(null);

    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete book"
      );
    }
  };

  return (
    <div className="space-y-4">

      {/* Search, Filter and Add Book */}
      <Card className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

        <div className="flex flex-1 flex-col gap-3 sm:flex-row">

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            <Input
              placeholder="Search by title, author, ID..."
              className="pl-9"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <Select
            value={filter}
            onValueChange={(v) => {
              setFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                All Categories
              </SelectItem>

              {cats.map((c) => (
                <SelectItem
                  key={c.id}
                  value={String(c.id)}
                >
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Add Book Dialog */}
        <Dialog
          open={dialogOpen}
          onOpenChange={(o: boolean) => {
            setDialogOpen(o);
            if (!o) setEditing(null);
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-1 h-4 w-4" />
              Add Book
            </Button>
          </DialogTrigger>

          <DialogContent>

            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Book" : "Add Book"}
              </DialogTitle>
            </DialogHeader>

            <form
              key={editing?.id ?? "new"}
              onSubmit={onSubmit}
              className="space-y-4"
            >

              {/* Book ID is generated by database */}
              {editing && (
                <div className="grid gap-2">
                  <Label>Book ID</Label>
                  <Input
                    value={editing.id}
                    disabled
                  />
                </div>
              )}

              <div className="grid gap-2">
                <Label>Title</Label>
                <Input
                  name="title"
                  defaultValue={editing?.title || ""}
                  maxLength={100}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Author</Label>
                <Input
                  name="author"
                  defaultValue={editing?.author || ""}
                  maxLength={500}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Category</Label>

                <select
                  name="category"
                  defaultValue={
                    String(editing?.category_id ?? cats[0]?.id ?? "")
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  {cats.map((c) => (
                    <option
                      key={c.id}
                      value={c.id}
                    >
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">

                <div className="grid gap-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    name="quantity"
                    min={0}
                    defaultValue={editing?.quantity ?? 1}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Available</Label>
                  <Input
                    type="number"
                    name="available"
                    min={0}
                    defaultValue={editing?.available ?? 1}
                    required
                  />
                </div>

              </div>

              <DialogFooter>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={saving || cats.length === 0}
                >
                  {saving
                    ? "Please wait..."
                    : editing
                      ? "Save changes"
                      : "Add book"}
                </Button>

              </DialogFooter>

            </form>
          </DialogContent>
        </Dialog>
      </Card>

      {/* Books Table */}
      <Card className="p-0 overflow-hidden">

        <div className="p-4 border-b">
          <h3 className="font-semibold">
            All Books{" "}
            <span className="text-muted-foreground font-normal">
              ({filtered.length})
            </span>
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            Loading books...
          </div>
        ) : pageItems.length === 0 ? (
          <EmptyState
            title="No books found"
            description="Try adjusting your search or add a new book."
          />
        ) : (
          <>
            <Table>

              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pageItems.map((b) => (
                  <TableRow key={b.id}>

                    <TableCell className="font-mono text-xs">
                      {b.id}
                    </TableCell>

                    <TableCell className="font-medium">
                      {b.title}
                    </TableCell>

                    <TableCell>
                      {b.author}
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary">
                        {b.category}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {b.available}/{b.quantity}
                    </TableCell>

                    <TableCell>
                      {b.available === 0 ? (
                        <Badge variant="destructive">
                          Unavailable
                        </Badge>
                      ) : b.available <= 1 ? (
                        <Badge className="bg-warning text-warning-foreground">
                          Low
                        </Badge>
                      ) : (
                        <Badge className="bg-success text-success-foreground">
                          Available
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditing(b);
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setToDelete(b)}
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

      {/* Delete Confirmation */}
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
