import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ConfirmModal } from "@/components/ConfirmModal";
import { EmptyState } from "@/components/EmptyState";
import { useLibraryStore, type Category } from "@/store/libraryStore";

export default function AdminCategories() {
  const items = useLibraryStore((s) => s.categories);
  const addCategory = useLibraryStore((s) => s.addCategory);
  const updateCategory = useLibraryStore((s) => s.updateCategory);
  const deleteCategory = useLibraryStore((s) => s.deleteCategory);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [toDelete, setToDelete] = useState<Category | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const payload = { name: String(f.get("name")), description: String(f.get("description")) };
    if (editing) {
      updateCategory(editing.id, payload);
      toast.success("Category updated");
    } else {
      addCategory(payload);
      toast.success("Category added");
    }
    setOpen(false); setEditing(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" /> Add Category</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit Category" : "Add Category"}</DialogTitle></DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid gap-2"><Label>Name</Label><Input name="name" defaultValue={editing?.name} required /></div>
              <div className="grid gap-2"><Label>Description</Label><Textarea name="description" defaultValue={editing?.description} /></div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit">{editing ? "Save" : "Add"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? <Card><EmptyState title="No categories" /></Card> :
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <Card key={c.id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => { setEditing(c); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => setToDelete(c)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>}

      <ConfirmModal
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete category?"
        description={`"${toDelete?.name}" will be removed.`}
        onConfirm={() => {
          if (!toDelete) return;
          deleteCategory(toDelete.id);
          toast.success("Category deleted"); setToDelete(null);
        }}
      />
    </div>
  );
}
