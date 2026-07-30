import { useEffect, useState, useCallback, useRef } from "react";
import {
  getServices,
  createService,
  updateService,
  deleteService,
  type Service,
} from "@/lib/server/services";
import { uploadImage } from "@/lib/server/upload";
import { TOKEN_KEY } from "@/lib/constants";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  ArrowUp,
  ArrowDown,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

const ICON_OPTIONS = [
  "ChefHat",
  "DoorOpen",
  "Tv",
  "Columns3",
  "Flame",
  "Box",
];
const ICON_LABELS: Record<string, string> = {
  ChefHat: "Modular Kitchen",
  DoorOpen: "Wardrobes",
  Tv: "TV Units",
  Columns3: "Hall Partition",
  Flame: "Pooja Units",
  Box: "3D Designing",
};
const DEFAULT_CATEGORIES = [
  "Kitchens", "Living Rooms", "Wardrobes", "Bedrooms",
  "Ceilings", "Pooja Units", "TV Units", "Entryway", "Dining", "All",
];

const emptyForm = {
  title: "",
  description: "",
  iconName: "Box",
  mainImage: "",
  mainImagePublicId: "",
  portfolioCategory: "Kitchens",
  order: 0,
};

function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) ?? "";
}

export function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadServices = useCallback(async () => {
    try {
      const { getGalleryCategories } = await import("@/lib/server/gallery");
      const [data, cats] = await Promise.all([
        getServices(),
        getGalleryCategories()
      ]);
      setServices(data);
      
      const dynamicCats = cats.map(c => c.name);
      setCategories(Array.from(new Set([...DEFAULT_CATEGORIES, ...dynamicCats])));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImagePreview(null);
    setShowForm(true);
    setError("");
  };

  const openEdit = (s: Service) => {
    setForm({
      title: s.title,
      description: s.description,
      iconName: s.iconName,
      mainImage: s.mainImage,
      mainImagePublicId: s.mainImagePublicId,
      portfolioCategory: s.portfolioCategory,
      order: s.order,
    });
    setImagePreview(s.mainImage || null);
    setEditingId(s._id!);
    setShowForm(true);
    setError("");
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    setError("");

    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const result = await uploadImage({
        data: {
          token: getToken(),
          base64,
          folder: "services",
        },
      });

      setForm((prev) => ({
        ...prev,
        mainImage: result.secure_url,
        mainImagePublicId: result.public_id,
      }));
      setImagePreview(result.secure_url);
    } catch (err) {
      setError("Image upload failed. Try again.");
      console.error(err);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.description) {
      setError("Title and description are required");
      return;
    }
    setSaving(true);
    setError("");

    try {
      if (editingId) {
        await updateService({
          data: { token: getToken(), id: editingId, service: form },
        });
      } else {
        await createService({
          data: { token: getToken(), service: form },
        });
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      setImagePreview(null);
      await loadServices();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    setDeleting(id);
    try {
      await deleteService({ data: { token: getToken(), id } });
      await loadServices();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-[var(--gold-muted)]" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[var(--espresso-deep)]">
            Services
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your service offerings
          </p>
        </div>
        <button onClick={openNew} className="btn-gold text-xs">
          <Plus className="size-3.5" />
          Add Service
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--espresso-deep)]">
                {editingId ? "Edit Service" : "New Service"}
              </h2>
              <button onClick={() => setShowForm(false)}>
                <X className="size-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--gold-muted)] focus:ring-1 focus:ring-[var(--gold-muted)]"
                  placeholder="e.g. Modular Kitchen"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--gold-muted)] focus:ring-1 focus:ring-[var(--gold-muted)]"
                  placeholder="Short description of the service"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Icon</label>
                  <select
                    value={form.iconName}
                    onChange={(e) => setForm({ ...form, iconName: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--gold-muted)] focus:ring-1 focus:ring-[var(--gold-muted)]"
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {ICON_LABELS[opt] ?? opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Portfolio Category
                  </label>
                  <select
                    value={form.portfolioCategory}
                    onChange={(e) =>
                      setForm({ ...form, portfolioCategory: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--gold-muted)] focus:ring-1 focus:ring-[var(--gold-muted)]"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ── Main Image Upload ── */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Main Image
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-6 transition-colors hover:border-[var(--gold-soft)]"
                >
                  {imageUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="size-6 animate-spin text-[var(--gold-muted)]" />
                      <span className="text-xs text-gray-400">Uploading...</span>
                    </div>
                  ) : imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-40 rounded-lg object-contain"
                    />
                  ) : (
                    <>
                      <Upload className="mb-2 size-6 text-gray-300" />
                      <p className="text-xs text-gray-400">
                        Click to upload from computer
                      </p>
                    </>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
                {form.mainImage && !imagePreview && (
                  <p className="mt-1 text-xs text-gray-400 truncate">
                    URL: {form.mainImage}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--gold-muted)] focus:ring-1 focus:ring-[var(--gold-muted)]"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-500 text-center">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || imageUploading}
                  className="btn-gold flex-1 justify-center text-xs"
                >
                  {saving ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : editingId ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {services.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">
            No services found. Click "Add Service" to get started.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {services.map((s, idx) => (
              <div
                key={s._id}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-1">
                  <button className="text-gray-300 hover:text-gray-500">
                    <ArrowUp className="size-3.5" />
                  </button>
                  <span className="w-4 text-center text-xs text-gray-400">{idx + 1}</span>
                  <button className="text-gray-300 hover:text-gray-500">
                    <ArrowDown className="size-3.5" />
                  </button>
                </div>
                {s.mainImage ? (
                  <img
                    src={s.mainImage}
                    alt={s.title}
                    className="size-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-gray-100">
                    <ImageIcon className="size-5 text-gray-300" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--espresso-deep)] truncate">
                    {s.title}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{s.description}</p>
                </div>
                <span className="hidden rounded-full bg-[var(--gold-soft)]/30 px-2.5 py-0.5 text-xs text-[var(--gold-muted)] sm:inline">
                  {s.portfolioCategory}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(s)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[var(--gold-muted)]"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(s._id!)}
                    disabled={deleting === s._id}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    {deleting === s._id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
