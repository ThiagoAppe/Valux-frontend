import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronRight, FolderPlus, ImagePlus, Pencil, Save, Trash2, Upload } from "lucide-react";
import { Link, Navigate } from "react-router-dom";

import useAuth from "../../context/useAuth";
import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  updateCategory,
  uploadCategoryImage,
} from "../../services/adminCategoryService";

const blankCategory = () => ({ name: "", parent_id: "", image_path: null, image_url: null });
const inputClass = "w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

const descendantsOf = (categoryId, categories) => {
  const descendants = new Set();
  const visit = (parentId) => categories.filter((category) => category.parent_id === parentId).forEach((child) => {
    descendants.add(child.id);
    visit(child.id);
  });
  visit(categoryId);
  return descendants;
};

const orderedCategories = (categories) => {
  const byParent = new Map();
  categories.forEach((category) => {
    const siblings = byParent.get(category.parent_id) || [];
    siblings.push(category);
    byParent.set(category.parent_id, siblings);
  });
  byParent.forEach((siblings) => siblings.sort((left, right) => left.name.localeCompare(right.name)));

  const flatten = (parentId = null, depth = 0) => (byParent.get(parentId) || []).flatMap((category) => [
    { ...category, depth },
    ...flatten(category.id, depth + 1),
  ]);
  return flatten();
};

const CategoryEditor = ({ category, categories, onSaved, onClose }) => {
  const [form, setForm] = useState(category ? { ...category, parent_id: category.parent_id ?? "" } : blankCategory);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setForm(category ? { ...category, parent_id: category.parent_id ?? "" } : blankCategory());
    setError("");
  }, [category]);

  const unavailableParents = useMemo(
    () => category ? new Set([category.id, ...descendantsOf(category.id, categories)]) : new Set(),
    [categories, category],
  );
  const parentOptions = useMemo(() => orderedCategories(categories), [categories]);

  const uploadImage = async (event) => {
    const [file] = event.target.files || [];
    event.target.value = "";
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const [image] = await uploadCategoryImage(file);
      setForm((current) => ({ ...current, image_path: image.path, image_url: image.url }));
    } catch (requestError) {
      setError(requestError.message || "No se pudo cargar la imagen.");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      parent_id: form.parent_id === "" ? null : Number(form.parent_id),
      image_path: form.image_path || null,
    };
    try {
      const savedCategory = category
        ? await updateCategory(category.id, payload)
        : await createCategory(payload);
      onSaved(savedCategory);
    } catch (requestError) {
      setError(requestError.message || "No se pudo guardar la categoría.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{category ? "Editar categoría" : "Nueva categoría"}</p><h2 className="mt-2 text-xl font-semibold">{category ? category.name : "Crear categoría"}</h2></div>{category && <button type="button" onClick={onClose} className="text-sm font-semibold text-text-secondary transition hover:text-primary">Nueva</button>}</div>
      {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <form onSubmit={submit} className="mt-6 space-y-5">
        <label className="block"><span className="mb-2 block text-sm font-medium">Nombre</span><input required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className={inputClass} /></label>
        <label className="block"><span className="mb-2 block text-sm font-medium">Categoría padre</span><select value={form.parent_id} onChange={(event) => setForm((current) => ({ ...current, parent_id: event.target.value }))} className={inputClass}><option value="">Sin categoría padre</option>{parentOptions.filter((item) => !unavailableParents.has(item.id)).map((item) => <option key={item.id} value={item.id}>{"— ".repeat(item.depth)}{item.name}</option>)}</select></label>
        <div><span className="mb-2 block text-sm font-medium">Imagen</span><div className="flex items-center gap-4 rounded-xl bg-background p-3"><img src={form.image_url || "https://placehold.co/120x120/f4ede3/3e2c23?text=Categor%C3%ADa"} alt="Vista previa de categoría" className="size-18 rounded-lg object-cover" /><div className="min-w-0"><label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-primary"><Upload size={16} />{uploading ? "Cargando…" : "Cargar imagen"}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadImage} disabled={uploading} className="sr-only" /></label>{form.image_path && <button type="button" onClick={() => setForm((current) => ({ ...current, image_path: null, image_url: null }))} className="mt-2 block text-xs font-medium text-text-secondary hover:text-red-700">Quitar imagen</button>}</div></div></div>
        {category && <div className="rounded-xl bg-background px-4 py-3 text-sm"><p className="text-text-secondary">Slug público</p><p className="mt-1 break-all font-mono font-semibold text-text">{category.slug}</p></div>}
        <button type="submit" disabled={saving || uploading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-background-dark px-5 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"><Save size={17} />{saving ? "Guardando…" : "Guardar categoría"}</button>
      </form>
    </section>
  );
};

const CategoriesList = ({ categories, loading, onEdit, onDelete }) => {
  const tree = useMemo(() => orderedCategories(categories), [categories]);
  if (loading) return <div className="mt-6 space-y-3">{Array.from({ length: 5 }, (_, index) => <div key={index} className="h-16 animate-pulse rounded-xl bg-primary-light/35" />)}</div>;
  if (!tree.length) return <div className="mt-6 rounded-2xl border border-dashed border-border bg-white p-10 text-center text-text-secondary">Todavía no hay categorías.</div>;
  return <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">{tree.map((category) => <article key={category.id} className="flex items-center gap-3 border-b border-border p-3 last:border-b-0" style={{ paddingLeft: `${0.75 + category.depth * 1.5}rem` }}><ChevronRight size={16} className={`shrink-0 text-primary ${category.depth ? "" : "rotate-90"}`} /><img src={category.image_url || "https://placehold.co/96x96/f4ede3/3e2c23?text=Cat"} alt="" className="size-10 rounded-lg object-cover" /><div className="min-w-0 flex-1"><p className="truncate font-semibold text-text">{category.name}</p><p className="mt-0.5 text-xs text-text-secondary">{category.children_count} subcategorías · {category.products_count} productos</p></div><button type="button" onClick={() => onEdit(category)} className="rounded-lg p-2 text-text-secondary transition hover:bg-background hover:text-primary" aria-label={`Editar ${category.name}`}><Pencil size={17} /></button><button type="button" disabled={category.children_count > 0 || category.products_count > 0} onClick={() => onDelete(category)} className="rounded-lg p-2 text-text-secondary transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-30" aria-label={`Eliminar ${category.name}`}><Trash2 size={17} /></button></article>)}</div>;
};

const AdminCategoriesMain = () => {
  const { user, isLoading } = useAuth();
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCategories = useCallback(() => {
    setLoading(true);
    getAdminCategories().then(setCategories).catch((requestError) => setError(requestError.message || "No se pudieron cargar las categorías.")).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user?.role === "admin") loadCategories();
  }, [loadCategories, user]);

  const removeCategory = async (category) => {
    if (!window.confirm(`¿Eliminar “${category.name}”? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteCategory(category.id);
      if (editing?.id === category.id) setEditing(null);
      loadCategories();
    } catch (requestError) {
      setError(requestError.message || "No se pudo eliminar la categoría.");
    }
  };

  if (isLoading) return <main className="flex min-h-[34rem] items-center justify-center text-text-secondary">Comprobando acceso administrativo…</main>;
  if (!user || user.role !== "admin") return <Navigate to="/panel" replace />;

  return <main className="mx-auto w-full max-w-7xl px-2 py-6 text-text sm:px-6 lg:py-10"><div className="flex flex-wrap items-end justify-between gap-4"><div><Link to="/panel" className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition hover:text-primary"><ArrowLeft size={16} />Panel</Link><p className="mt-5 text-sm font-bold uppercase tracking-[0.26em] text-primary">Administración · Catálogo</p><h1 className="mt-2 text-3xl font-semibold">Categorías</h1><p className="mt-2 text-text-secondary">Organizá el árbol de navegación y las colecciones del sitio.</p></div><button type="button" onClick={() => setEditing(null)} className="inline-flex items-center gap-2 rounded-xl bg-background-dark px-5 py-3 font-semibold text-white transition hover:bg-primary-dark"><FolderPlus size={18} />Nueva categoría</button></div>{error && <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<div className="mt-8 grid gap-6 lg:grid-cols-[1fr_24rem]"><section><div className="flex items-center gap-3"><div className="rounded-xl bg-primary/10 p-2.5 text-primary"><ImagePlus size={20} /></div><div><h2 className="font-semibold">Árbol de categorías</h2><p className="text-sm text-text-secondary">Podés mover una categoría asignándole otra categoría padre.</p></div></div><CategoriesList categories={categories} loading={loading} onEdit={setEditing} onDelete={removeCategory} /></section><CategoryEditor key={editing?.id || "new"} category={editing} categories={categories} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); loadCategories(); }} /></div></main>;
};

export default AdminCategoriesMain;
