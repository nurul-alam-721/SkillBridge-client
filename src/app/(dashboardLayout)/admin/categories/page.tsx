"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  categoryService,
  Category,
  CategoryPayload,
} from "@/services/category.service";
import { CategoriesTable } from "@/components/modules/adminDashboard/categories/CategoriesTable";
import { CategoryDialog } from "@/components/modules/adminDashboard/categories/CategoryDialog";
import { DeleteCategoryDialog } from "@/components/modules/adminDashboard/categories/DeleteCategoryDialog";

function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const e = err as { response?: { data?: { message?: string } } };
    if (e.response?.data?.message) return e.response.data.message;
  }
  return "Something went wrong. Please try again.";
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const load = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      setCategories(await categoryService.getAll());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      if (silent) setRefreshing(false);
      else setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = useCallback(async (payload: CategoryPayload) => {
    const created = await categoryService.create(payload);
    setCategories((prev) =>
      [...prev, created].sort((a, b) => a.name.localeCompare(b.name)),
    );
    toast.success(`"${created.name}" created`);
  }, []);

  const handleEdit = useCallback(
    async (payload: CategoryPayload) => {
      if (!editTarget) return;
      const updated = await categoryService.update(editTarget.id, payload);
      setCategories((prev) =>
        prev
          .map((c) => (c.id === updated.id ? updated : c))
          .sort((a, b) => a.name.localeCompare(b.name)),
      );
      toast.success(`"${updated.name}" updated`);
    },
    [editTarget],
  );

  const handleDelete = useCallback(async (id: string) => {
    try {
      await categoryService.remove(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Category deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }, []);

  const openCreate = () => {
    setEditTarget(null);
    setDialogOpen(true);
  };
  const openEdit = (c: Category) => {
    setEditTarget(c);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-5 p-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage subject categories for tutors
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl"
            onClick={() => load(true)}
            disabled={loading || refreshing}
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button size="sm" className="gap-2 rounded-xl" onClick={openCreate}>
            <Plus className="h-3.5 w-3.5" />
            New Category
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Table */}
      <CategoriesTable
        categories={categories}
        loading={loading}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />

      {/* Create / Edit dialog */}
      <CategoryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={dialogOpen && editTarget ? handleEdit : handleCreate}
        initial={editTarget}
      />

      {/* Delete confirm dialog */}
      <DeleteCategoryDialog
        category={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
