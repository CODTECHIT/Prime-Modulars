import { useEffect, useState, useCallback, useRef } from "react";
import {
  getGalleryImages,
  uploadGalleryImage,
  deleteGalleryImage,
  getGalleryCategories,
  createGalleryCategory,
  deleteGalleryCategory,
  getGalleryUploadConfig,
  saveGalleryVideo,
  type GalleryImage,
  type GalleryCategory,
} from "@/lib/server/gallery";
import { TOKEN_KEY } from "@/lib/constants";
import { clearCache } from "@/lib/cache";
import {
  Upload,
  Trash2,
  X,
  Loader2,
  Image,
  FolderPlus,
  Film,
  ChevronLeft,
  Video,
  FileVideo,
} from "lucide-react";

function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) ?? "";
}

export function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState<string>("All");
  const [showUpload, setShowUpload] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState<"image" | "single" | "video">("image");
  const [uploadStep, setUploadStep] = useState<1 | 2>(1);
  const [uploadCat, setUploadCat] = useState<string>("Kitchens");
  const [uploadError, setUploadError] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const beforeFileRef = useRef<HTMLInputElement>(null);
  const videoFileRef = useRef<HTMLInputElement>(null);

  const loadData = useCallback(async () => {
    try {
      const [imgs, cats] = await Promise.all([getGalleryImages({}), getGalleryCategories()]);
      setImages(imgs);
      setCategories(cats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const allCategories = [
    "All",
    ...categories.map((c) => c.name),
    "Kitchens",
    "Living Rooms",
    "Wardrobes",
    "Bedrooms",
    "Ceilings",
    "Pooja Units",
    "TV Units",
    "Entryway",
    "Dining",
  ].filter((v, i, a) => a.indexOf(v) === i);

  const filtered =
    selectedCat === "All" ? images : images.filter((img) => img.category === selectedCat);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleBeforeFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBeforeFile(file);
    setBeforePreview(URL.createObjectURL(file));
  };

  const handleVideoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const uploadVideoToCloudinary = async (file: File, category: string) => {
    const config = await getGalleryUploadConfig({
      data: { token: getToken(), type: "video", category },
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", config.apiKey);
    formData.append("timestamp", config.timestamp);
    formData.append("signature", config.signature);
    formData.append("folder", config.folder);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/video/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Cloudinary upload failed (${res.status})`);
    }
    return (await res.json()) as { secure_url: string; public_id: string };
  };

  const handleUpload = async () => {
    if (!newCaption || (uploadType === "video" ? !videoFile : !selectedFile)) return;
    setUploading(true);
    setUploadError("");
    try {
      if (uploadType === "video") {
        const file = videoFile!;
        const result = await uploadVideoToCloudinary(file, uploadCat);
        await saveGalleryVideo({
          data: {
            token: getToken(),
            publicId: result.public_id,
            secureUrl: result.secure_url,
            category: uploadCat,
            caption: newCaption,
          },
        });
      } else {
        const file = selectedFile!;
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        let beforeBase64: string | undefined;
        if (beforeFile) {
          const beforeReader = new FileReader();
          beforeBase64 = await new Promise<string>((resolve, reject) => {
            beforeReader.onload = () => resolve(beforeReader.result as string);
            beforeReader.onerror = reject;
            beforeReader.readAsDataURL(beforeFile);
          });
        }

        await uploadGalleryImage({
          data: {
            token: getToken(),
            type: "image",
            base64,
            beforeBase64,
            category: uploadCat,
            caption: newCaption,
          },
        });
      }

      clearCache("gallery_images");
      setShowUpload(false);
      setUploadStep(1);
      setUploadType("image");
      setUploadCat("Kitchens");
      setUploadError("");
      setSelectedFile(null);
      setPreview(null);
      setBeforeFile(null);
      setBeforePreview(null);
      setVideoFile(null);
      setVideoPreview(null);
      setNewCaption("");
      await loadData();
    } catch (e) {
      console.error(e);
      setUploadError(e instanceof Error ? e.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    setDeleting(id);
    try {
      await deleteGalleryImage({ data: { token: getToken(), id } });
      clearCache("gallery_images");
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(null);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCatName) return;
    try {
      await createGalleryCategory({
        data: { token: getToken(), name: newCatName, description: newCatDesc },
      });
      setShowNewCategory(false);
      setNewCatName("");
      setNewCatDesc("");
      await loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCategory = async (name: string) => {
    const category = categories.find((c) => c.name === name);
    if (!category?._id) return;
    if (!confirm(`Delete the "${name}" category and all its images?`)) return;
    try {
      await deleteGalleryCategory({ data: { token: getToken(), id: category._id } });
      setSelectedCat("All");
      await loadData();
    } catch (e) {
      console.error(e);
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
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[var(--espresso-deep)]">
            Gallery
          </h1>
          <p className="mt-1 text-sm text-gray-500">Manage category-based gallery images</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowNewCategory(true)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            <FolderPlus className="size-3.5" />
            New Category
          </button>
          <button
            onClick={() => {
              setUploadStep(1);
              setUploadCat(selectedCat === "All" ? "Kitchens" : selectedCat);
              setUploadError("");
              setShowUpload(true);
            }}
            className="btn-gold text-xs"
          >
            <Upload className="size-3.5" />
            Upload
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {allCategories.map((cat) => (
          <div key={cat} className="relative">
            <button
              onClick={() => setSelectedCat(cat)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedCat === cat
                  ? "border-[var(--gold-muted)] bg-[var(--gold-muted)] text-white"
                  : "border-gray-200 text-gray-500 hover:border-[var(--gold-soft)] hover:text-[var(--gold-muted)]"
              } ${selectedCat === cat && cat !== "All" ? "pr-8" : ""}`}
            >
              {cat}
            </button>
            {selectedCat === cat && cat !== "All" && (
              <button
                onClick={() => handleDeleteCategory(cat)}
                title={`Delete category ${cat}`}
                aria-label={`Delete category ${cat}`}
                className="absolute right-1 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/20 hover:text-white"
              >
                <Trash2 className="size-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--espresso-deep)]">
                {uploadStep === 1
                  ? "Add to Gallery"
                  : `Upload ${
                      uploadType === "video"
                        ? "Video"
                        : uploadType === "single"
                          ? "Single Photo"
                          : "Image"
                    }`}
              </h2>
              <button onClick={() => setShowUpload(false)}>
                <X className="size-5 text-gray-500" />
              </button>
            </div>

            {uploadStep === 1 ? (
              <div className="space-y-4">
                <p className="text-xs text-gray-500">Choose what you want to add to the gallery.</p>
                <button
                  onClick={() => {
                    setUploadType("image");
                    setUploadStep(2);
                  }}
                  className="flex w-full items-center gap-4 rounded-xl border-2 border-dashed border-gray-200 p-5 text-left transition-colors hover:border-[var(--gold-soft)] hover:bg-gray-50"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-[var(--gold-soft)] text-[var(--gold-muted)]">
                    <Image className="size-6" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-[var(--espresso-deep)]">
                      Before/After Image
                    </span>
                    <span className="block text-xs text-gray-400">
                      Pair of photos shown with a before/after slider
                    </span>
                  </span>
                </button>
                <button
                  onClick={() => {
                    setUploadType("single");
                    setUploadStep(2);
                  }}
                  className="flex w-full items-center gap-4 rounded-xl border-2 border-dashed border-gray-200 p-5 text-left transition-colors hover:border-[var(--gold-soft)] hover:bg-gray-50"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-[var(--gold-soft)] text-[var(--gold-muted)]">
                    <Image className="size-6" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-[var(--espresso-deep)]">
                      Single Photo
                    </span>
                    <span className="block text-xs text-gray-400">
                      One photo, no before/after slider
                    </span>
                  </span>
                </button>
                <button
                  onClick={() => {
                    setUploadType("video");
                    setUploadStep(2);
                  }}
                  className="flex w-full items-center gap-4 rounded-xl border-2 border-dashed border-gray-200 p-5 text-left transition-colors hover:border-[var(--gold-soft)] hover:bg-gray-50"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-[var(--gold-soft)] text-[var(--gold-muted)]">
                    <Film className="size-6" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-[var(--espresso-deep)]">
                      Video
                    </span>
                    <span className="block text-xs text-gray-400">
                      Single video clip, no before/after
                    </span>
                  </span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => setUploadStep(1)}
                  className="flex items-center gap-1 text-xs font-medium text-gray-500 transition-colors hover:text-[var(--gold-muted)]"
                >
                  <ChevronLeft className="size-4" />
                  Back
                </button>

                {uploadType === "video" ? (
                  <div
                    onClick={() => videoFileRef.current?.click()}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-4 transition-colors hover:border-[var(--gold-soft)] text-center h-40"
                  >
                    {videoPreview ? (
                      <video
                        src={videoPreview}
                        controls
                        className="h-full w-full rounded-lg object-contain"
                      />
                    ) : (
                      <>
                        <FileVideo className="mb-2 size-8 text-gray-300" />
                        <p className="text-xs text-gray-400">Video file (Required)</p>
                        <p className="mt-1 text-[10px] text-gray-300">MP4, up to 150MB</p>
                      </>
                    )}
                    <input
                      ref={videoFileRef}
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileSelect}
                      className="hidden"
                    />
                  </div>
                ) : uploadType === "single" ? (
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-4 transition-colors hover:border-[var(--gold-soft)] text-center h-40"
                  >
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-full w-full rounded-lg object-contain"
                      />
                    ) : (
                      <>
                        <Image className="mb-2 size-8 text-gray-300" />
                        <p className="text-xs text-gray-400">Photo (Required)</p>
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
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      onClick={() => beforeFileRef.current?.click()}
                      className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-4 transition-colors hover:border-[var(--gold-soft)] text-center h-32"
                    >
                      {beforePreview ? (
                        <img
                          src={beforePreview}
                          alt="Before Preview"
                          className="h-full w-full rounded-lg object-contain"
                        />
                      ) : (
                        <>
                          <Image className="mb-2 size-6 text-gray-300" />
                          <p className="text-xs text-gray-400">Before Image (Optional)</p>
                        </>
                      )}
                      <input
                        ref={beforeFileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleBeforeFileSelect}
                        className="hidden"
                      />
                    </div>
                    <div
                      onClick={() => fileRef.current?.click()}
                      className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-4 transition-colors hover:border-[var(--gold-soft)] text-center h-32"
                    >
                      {preview ? (
                        <img
                          src={preview}
                          alt="Preview"
                          className="h-full w-full rounded-lg object-contain"
                        />
                      ) : (
                        <>
                          <Image className="mb-2 size-6 text-gray-300" />
                          <p className="text-xs text-gray-400">Main/After Image (Required)</p>
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
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                  <select
                    value={uploadCat}
                    onChange={(e) => setUploadCat(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--gold-muted)]"
                  >
                    {allCategories
                      .filter((c) => c !== "All")
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Caption</label>
                  <input
                    type="text"
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--gold-muted)]"
                    placeholder="e.g. Contemporary Kitchen"
                  />
                </div>
                {uploadError && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                    {uploadError}
                  </p>
                )}
                <button
                  onClick={handleUpload}
                  disabled={
                    uploading ||
                    !newCaption ||
                    (uploadType === "video" ? !videoFile : !selectedFile)
                  }
                  className="btn-gold w-full justify-center text-xs"
                >
                  {uploading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    `Upload ${
                      uploadType === "video"
                        ? "Video"
                        : uploadType === "single"
                          ? "Single Photo"
                          : "Image"
                    } to Cloudinary`
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showNewCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--espresso-deep)]">New Category</h2>
              <button onClick={() => setShowNewCategory(false)}>
                <X className="size-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--gold-muted)]"
                  placeholder="e.g. Bathrooms"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--gold-muted)]"
                  placeholder="Optional description"
                />
              </div>
              <button
                onClick={handleCreateCategory}
                className="btn-gold w-full justify-center text-xs"
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="py-12 text-center text-sm text-gray-400">
          No images in this category. Upload some images.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((img) => (
            <div
              key={img._id}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-gray-200"
            >
              {img.type === "video" ? (
                <video
                  src={img.src}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <img
                  src={img.src}
                  alt={img.caption}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              )}
              {img.type === "video" && (
                <span className="absolute top-2 left-2 z-10 grid size-7 place-items-center rounded-full bg-black/60 text-white backdrop-blur-sm">
                  <Film className="size-3.5" />
                </span>
              )}
              <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/70 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => handleDeleteImage(img._id!)}
                  disabled={deleting === img._id}
                  className="self-end rounded-lg bg-white/20 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-red-500/50"
                >
                  {deleting === img._id ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                </button>
                <p className="text-xs text-white drop-shadow-lg">{img.caption}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
