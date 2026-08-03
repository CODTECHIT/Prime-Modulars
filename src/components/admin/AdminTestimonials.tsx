import { useEffect, useState, useCallback, useRef } from "react";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  type Testimonial,
} from "@/lib/server/testimonials";
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
  Star,
  Quote,
} from "lucide-react";

const emptyForm = {
  name: "",
  location: "",
  project: "",
  quote: "",
  rating: 5,
  image: "",
  imagePublicId: "",
  order: 0,
};

function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) ?? "";
}

export function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
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

  const loadTestimonials = useCallback(async () => {
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImagePreview(null);
    setShowForm(true);
    setError("");
  };

  const openEdit = (t: Testimonial) => {
    setForm({
      name: t.name,
      location: t.location,
      project: t.project,
      quote: t.quote,
      rating: t.rating ?? 5,
      image: t.image ?? "",
      imagePublicId: t.imagePublicId ?? "",
      order: t.order ?? 0,
    });
    setImagePreview(t.image || null);
    setEditingId(t._id!);
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
          folder: "testimonials",
        },
      });

      setForm((prev) => ({
        ...prev,
        image: result.secure_url,
        imagePublicId: result.public_id,
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
    if (!form.name || !form.quote || !form.project || !form.location) {
      setError("Name, location, project, and quote are required");
      return;
    }
    setSaving(true);
    setError("");

    try {
      if (editingId) {
        await updateTestimonial({
          data: { token: getToken(), id: editingId, testimonial: form },
        });
      } else {
        await createTestimonial({
          data: { token: getToken(), testimonial: form },
        });
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      setImagePreview(null);
      await loadTestimonials();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save testimonial");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    setDeleting(id);
    try {
      await deleteTestimonial({ data: { token: getToken(), id } });
      await loadTestimonials();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(null);
    }
  };

  const moveOrder = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= testimonials.length) return;

    const t1 = testimonials[index];
    const t2 = testimonials[targetIdx];

    try {
      // Swap order
      const order1 = t1.order;
      const order2 = t2.order;

      // Update both
      await Promise.all([
        updateTestimonial({
          data: { token: getToken(), id: t1._id!, testimonial: { order: order2 } },
        }),
        updateTestimonial({
          data: { token: getToken(), id: t2._id!, testimonial: { order: order1 } },
        }),
      ]);

      await loadTestimonials();
    } catch (e) {
      console.error("Failed to reorder testimonials", e);
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
            Testimonials
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your client reviews and testimonials section
          </p>
        </div>
        <button onClick={openNew} className="btn-gold text-xs">
          <Plus className="size-3.5" />
          Add Testimonial
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--espresso-deep)]">
                {editingId ? "Edit Testimonial" : "New Testimonial"}
              </h2>
              <button onClick={() => setShowForm(false)}>
                <X className="size-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Client Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--gold-muted)] focus:ring-1 focus:ring-[var(--gold-muted)]"
                    placeholder="e.g. Ramesh Kumar"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--gold-muted)] focus:ring-1 focus:ring-[var(--gold-muted)]"
                    placeholder="e.g. Tadepalli"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Project Type</label>
                  <input
                    type="text"
                    value={form.project}
                    onChange={(e) => setForm({ ...form, project: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--gold-muted)] focus:ring-1 focus:ring-[var(--gold-muted)]"
                    placeholder="e.g. Modular Kitchen"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Rating</label>
                  <div className="flex items-center gap-1.5 py-2.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setForm({ ...form, rating: i + 1 })}
                        className="text-gray-300 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`size-6 ${
                            i < form.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Quote</label>
                <textarea
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--gold-muted)] focus:ring-1 focus:ring-[var(--gold-muted)]"
                  placeholder="Review / feedback from client"
                />
              </div>

              {/* Showcase Image Upload */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Project Photo / Client Photo (Optional)
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
                {form.image && !imagePreview && (
                  <p className="mt-1 text-xs text-gray-400 truncate">
                    URL: {form.image}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Display Order</label>
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
        {testimonials.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">
            No testimonials found in database. The homepage is currently running on the default fallback testimonials. Click "Add Testimonial" to create your first dynamic testimonial.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {testimonials.map((t, idx) => (
              <div
                key={t._id}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveOrder(idx, "up")}
                    disabled={idx === 0}
                    className="text-gray-300 hover:text-gray-500 disabled:opacity-30"
                  >
                    <ArrowUp className="size-3.5" />
                  </button>
                  <span className="w-4 text-center text-xs text-gray-400">{idx + 1}</span>
                  <button
                    onClick={() => moveOrder(idx, "down")}
                    disabled={idx === testimonials.length - 1}
                    className="text-gray-300 hover:text-gray-500 disabled:opacity-30"
                  >
                    <ArrowDown className="size-3.5" />
                  </button>
                </div>
                {t.image ? (
                  <img
                    src={t.image}
                    alt={t.name}
                    className="size-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-gray-100">
                    <Quote className="size-5 text-gray-300" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[var(--espresso-deep)] truncate">
                      {t.name}
                    </p>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3 ${
                            i < (t.rating ?? 5) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {t.project} &bull; {t.location}
                  </p>
                  <p className="mt-1 text-xs text-gray-600 line-clamp-1 italic">
                    "{t.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(t)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[var(--gold-muted)]"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(t._id!)}
                    disabled={deleting === t._id}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    {deleting === t._id ? (
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
