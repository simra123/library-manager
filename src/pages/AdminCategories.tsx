
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

// The API client is JavaScript and currently has no TypeScript declaration.
// @ts-ignore
import api from "../services/api";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

import { ConfirmModal } from "../components/ConfirmModal";
import { EmptyState } from "../components/EmptyState";

interface Category {
  id: number;
  name: string;
  description: string;
}

interface ApiCategory {
  Id: number;
  Name: string;
  Description: string | null;
}

const mapCategory = (data: ApiCategory): Category => ({
  id: data.Id,
  name: data.Name,
  description: data.Description || "",
});

export default function AdminCategories() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [toDelete, setToDelete] = useState<Category | null>(null);

  // GET: Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await api.get("/categories");

      setItems(response.data.categories.map(mapCategory));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // POST / PUT: Add or update category
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    const payload = {
      name: String(form.get("name")).trim(),
      description: String(form.get("description") || "").trim(),
    };

    try {
      setSaving(true);

      if (editing) {
        // PUT: Update category
        const response = await api.put(
          `/categories/${editing.id}`,
          payload
        );

        const updatedCategory = mapCategory(response.data.category);

        setItems((prev) =>
          prev.map((item) =>
            item.id === updatedCategory.id ? updatedCategory : item
          )
        );

        toast.success("Category updated");
      } else {
        // POST: Add category
        const response = await api.post("/categories", payload);

        const newCategory = mapCategory(response.data.category);

        setItems((prev) => [...prev, newCategory]);

        toast.success("Category added");
      }

      setOpen(false);
      setEditing(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  // DELETE: Remove category
  const handleDelete = async () => {
    if (!toDelete) return;

    try {
      await api.delete(`/categories/${toDelete.id}`);

      setItems((prev) =>
        prev.filter((item) => item.id !== toDelete.id)
      );

      toast.success("Category deleted");
      setToDelete(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete category"
      );
    }
  };

  return (
    <div className="space-y-4">

      {/* Add Category Button */}
      <div className="flex justify-end">
        <Dialog
          open={open}
          onOpenChange={(value) => {
            setOpen(value);
            if (!value) setEditing(null);
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-1 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Category" : "Add Category"}
              </DialogTitle>
            </DialogHeader>

            <form
              key={editing?.id ?? "new"}
              onSubmit={onSubmit}
              className="space-y-4"
            >
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input
                  name="name"
                  defaultValue={editing?.name || ""}
                  maxLength={100}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                  name="description"
                  defaultValue={editing?.description || ""}
                  maxLength={500}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={saving}>
                  {saving
                    ? "Please wait..."
                    : editing
                      ? "Save"
                      : "Add"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories List */}
      {loading ? (
        <Card className="p-8 text-center text-muted-foreground">
          Loading categories...
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState title="No categories" />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <Card key={c.id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{c.name}</h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {c.description}
                  </p>
                </div>

                <div className="flex gap-1">
                  {/* Edit */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditing(c);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  {/* Delete */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setToDelete(c)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        open={!!toDelete}
        onOpenChange={(value) => {
          if (!value) setToDelete(null);
        }}
        title="Delete category?"
        description={`"${toDelete?.name}" will be removed.`}
        onConfirm={handleDelete}
      />

    </div>
  );
}
