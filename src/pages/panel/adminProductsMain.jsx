import { useCallback, useEffect, useMemo, useState } from "react";
import { Archive, ArrowLeft, Boxes, ImagePlus, Layers3, Pencil, Plus, Save, Search, Tags, Trash2, Upload } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";
import { archiveProduct, createOptionType, createProduct, getMetadata, getProduct, getProducts, updateProduct, uploadProductImages } from "../../services/adminProductService";
import { apiUrl } from "../../services/api/config";

const blankVariant = () => ({ name: "", price: "0", active: true, stock_available: "0", stock_reserved: "0", options: [] });
const blankProduct = () => ({ name: "", description: "", active: true, category_ids: [], images: [], variants: [blankVariant()], featured_position: "" });
const formatPrice = (price) => Number(price ?? 0).toLocaleString("es-AR");

const imagePreview = (path) => path?.startsWith("http") ? path : apiUrl(`/static/${path?.replace(/^\/+/, "")}`);

const Field = ({ label, children, full = false }) => <label className={`block ${full ? "sm:col-span-2" : ""}`}><span className="mb-2 block text-sm font-medium text-text">{label}</span>{children}</label>;
const inputClass = "w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
const optionCodeFromName = (name) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 12);

const ProductEditor = ({ productId, onClose, onSaved }) => {
  const [product, setProduct] = useState(blankProduct);
  const [metadata, setMetadata] = useState({ categories: [], option_types: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [nextMetadata, existingProduct] = await Promise.all([getMetadata(), productId ? getProduct(productId) : Promise.resolve(null)]);
        if (!active) return;
        setMetadata(nextMetadata);
        if (existingProduct) setProduct({ ...existingProduct, featured_position: existingProduct.featured_position ?? "", variants: existingProduct.variants.map((variant) => ({ ...variant, price: String(variant.price), stock_available: String(variant.stock_available), stock_reserved: String(variant.stock_reserved) })) });
      } catch (requestError) {
        if (active) setError(requestError.message || "No se pudo cargar el editor.");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [productId]);

  const updateProductField = (field, value) => setProduct((current) => ({ ...current, [field]: value }));
  const updateVariant = (index, field, value) => setProduct((current) => ({ ...current, variants: current.variants.map((variant, variantIndex) => variantIndex === index ? { ...variant, [field]: value } : variant) }));
  const updateOption = (variantIndex, optionIndex, field, value) => setProduct((current) => ({ ...current, variants: current.variants.map((variant, currentVariantIndex) => currentVariantIndex === variantIndex ? { ...variant, options: variant.options.map((option, currentOptionIndex) => currentOptionIndex === optionIndex ? { ...option, [field]: value } : option) } : variant) }));
  const toggleCategory = (categoryId) => setProduct((current) => ({ ...current, category_ids: current.category_ids.includes(categoryId) ? current.category_ids.filter((id) => id !== categoryId) : [...current.category_ids, categoryId] }));

  const validateProduct = () => {
    for (const [variantIndex, variant] of product.variants.entries()) {
      if (!Number.isFinite(Number(variant.price)) || Number(variant.price) < 0 || !Number.isFinite(Number(variant.stock_available)) || Number(variant.stock_available) < 0 || !Number.isFinite(Number(variant.stock_reserved)) || Number(variant.stock_reserved) < 0) {
        return `Revisá el precio y el stock de la variante ${variantIndex + 1}.`;
      }
      const selectedTypes = new Set();
      for (const option of variant.options) {
        if (!option.option_type_id || !option.value.trim() || !option.code.trim()) return `Completá el tipo, valor y código de cada opción de la variante ${variantIndex + 1}.`;
        if (selectedTypes.has(option.option_type_id)) return `No se puede repetir el mismo tipo de opción en la variante ${variantIndex + 1}.`;
        selectedTypes.add(option.option_type_id);
      }
    }
    return "";
  };

  const uploadImages = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;

    setError("");
    setUploadingImages(true);
    try {
      const uploadedImages = await uploadProductImages(files);
      setProduct((current) => ({
        ...current,
        images: [
          ...current.images,
          ...uploadedImages.map((image, index) => ({
            ...image,
            sort_order: current.images.length + index + 1,
          })),
        ],
      }));
    } catch (requestError) {
      setError(requestError.message || "No se pudieron cargar las imágenes.");
    } finally {
      setUploadingImages(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    const validationError = validateProduct();
    if (validationError) {
      setError(validationError);
      return;
    }
    const payload = {
      name: product.name.trim(),
      description: product.description || null,
      active: product.active,
      category_ids: product.category_ids,
      featured_position: product.featured_position === "" ? null : Number(product.featured_position),
      images: product.images.filter((image) => image.path.trim()).map((image, index) => ({ ...(image.id ? { id: image.id } : {}), path: image.path.trim(), sort_order: Number(image.sort_order || index + 1) })),
      variants: product.variants.map((variant) => ({ ...(variant.id ? { id: variant.id } : {}), name: variant.name?.trim() || null, price: Number(variant.price), active: variant.active, stock_available: Number(variant.stock_available), stock_reserved: Number(variant.stock_reserved), options: variant.options.map((option) => ({ option_type_id: Number(option.option_type_id), value: option.value.trim(), code: option.code.trim() })) })),
    };

    setSaving(true);
    try {
      if (productId) await updateProduct(productId, payload);
      else await createProduct(payload);
      onSaved();
    } catch (requestError) {
      setError(requestError.message || "No se pudo guardar el producto.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <main className="mx-auto flex min-h-[34rem] max-w-7xl items-center justify-center text-text-secondary">Cargando editor de producto…</main>;

  return (
    <main className="mx-auto w-full max-w-7xl px-2 py-6 text-text sm:px-6 lg:py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><button type="button" onClick={onClose} className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition hover:text-primary"><ArrowLeft size={16} />Volver a productos</button><p className="mt-5 text-sm font-bold uppercase tracking-[0.26em] text-primary">Administración · Productos</p><h1 className="mt-2 text-3xl font-semibold">{productId ? "Editar producto" : "Nuevo producto"}</h1></div><button type="submit" form="product-editor" disabled={saving || uploadingImages} className="inline-flex items-center gap-2 rounded-xl bg-background-dark px-5 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-wait disabled:opacity-60"><Save size={18} />{uploadingImages ? "Cargando imágenes…" : saving ? "Guardando…" : "Guardar producto"}</button></div>
      {error && <p role="alert" className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <form id="product-editor" onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_21rem]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-primary/10 p-2.5 text-primary"><Boxes size={20} /></div><div><h2 className="font-semibold">Información principal</h2><p className="text-sm text-text-secondary">Los datos que identifican al producto en el catálogo.</p></div></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><Field label="Nombre" full><input required value={product.name} onChange={(event) => updateProductField("name", event.target.value)} className={inputClass} /></Field><Field label="Descripción" full><textarea value={product.description || ""} onChange={(event) => updateProductField("description", event.target.value)} rows="5" className={inputClass} /></Field></div><label className="mt-5 flex items-center gap-3 text-sm font-medium"><input type="checkbox" checked={product.active} onChange={(event) => updateProductField("active", event.target.checked)} className="size-4 accent-primary" />Producto visible en el catálogo</label></section>

          <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-primary/10 p-2.5 text-primary"><Tags size={20} /></div><div><h2 className="font-semibold">Categorías</h2><p className="text-sm text-text-secondary">Elegí dónde podrá encontrarse este producto. La primera categoría elegida define su prefijo.</p></div></div><div className="mt-6 flex flex-wrap gap-2">{metadata.categories.map((category) => <label key={category.id} className={`cursor-pointer rounded-full border px-3 py-2 text-sm transition ${product.category_ids.includes(category.id) ? "border-primary bg-primary text-white" : "border-border bg-white text-text-secondary hover:border-primary"}`}><input type="checkbox" checked={product.category_ids.includes(category.id)} onChange={() => toggleCategory(category.id)} className="sr-only" />{category.name}{product.category_ids[0] === category.id && <span className="ml-2 text-xs font-bold">Principal</span>}</label>)}</div></section>

          <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><div className="rounded-xl bg-primary/10 p-2.5 text-primary"><ImagePlus size={20} /></div><div><h2 className="font-semibold">Imágenes</h2><p className="text-sm text-text-secondary">Cargá fotos JPG, PNG o WebP de hasta 10 MB.</p></div></div><label className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-primary transition hover:bg-primary/10"><Upload size={16} />{uploadingImages ? "Cargando…" : "Cargar imágenes"}<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={uploadImages} disabled={uploadingImages} className="sr-only" /></label></div><div className="mt-6 space-y-3">{product.images.map((image, index) => <div key={image.id ?? image.path} className="grid gap-3 rounded-xl bg-background p-3 sm:grid-cols-[5rem_1fr_auto]"><img src={image.url || imagePreview(image.path)} alt={`Imagen ${index + 1}`} className="h-20 w-20 rounded-lg object-cover" /><div className="self-center"><p className="text-sm font-medium text-text">Imagen {index + 1}</p><label className="mt-2 flex max-w-32 items-center gap-2 text-xs text-text-secondary">Orden<input aria-label={`Orden de imagen ${index + 1}`} type="number" min="1" value={image.sort_order} onChange={(event) => updateProductField("images", product.images.map((current, currentIndex) => currentIndex === index ? { ...current, sort_order: event.target.value } : current))} className="w-16 rounded-lg border border-border bg-white px-2 py-1.5 text-sm text-text outline-none focus:border-primary" /></label></div><button type="button" onClick={() => updateProductField("images", product.images.filter((_, currentIndex) => currentIndex !== index))} className="self-center p-2 text-text-secondary transition hover:text-red-700" aria-label={`Quitar imagen ${index + 1}`}><Trash2 size={18} /></button></div>)}{!product.images.length && <p className="rounded-xl bg-background p-4 text-sm text-text-secondary">Todavía no cargaste imágenes.</p>}</div></section>

          <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><div className="rounded-xl bg-primary/10 p-2.5 text-primary"><Layers3 size={20} /></div><div><h2 className="font-semibold">Variantes e inventario</h2><p className="text-sm text-text-secondary">El sistema asigna un SKU único a cada variante.</p></div></div><button type="button" onClick={() => updateProductField("variants", [...product.variants, blankVariant()])} className="inline-flex items-center gap-1 text-sm font-semibold text-primary"><Plus size={16} />Agregar variante</button></div><div className="mt-6 space-y-5">{product.variants.map((variant, variantIndex) => <div key={variant.id ?? `variant-${variantIndex}`} className="rounded-2xl border border-border p-4"><div className="flex items-center justify-between gap-3"><div><h3 className="font-semibold">Variante {variantIndex + 1}</h3>{variant.sku && <p className="mt-1 text-xs font-medium text-text-secondary">SKU: {variant.sku}</p>}</div><button type="button" disabled={product.variants.length === 1} onClick={() => updateProductField("variants", product.variants.filter((_, index) => index !== variantIndex))} className="inline-flex items-center gap-1 text-sm text-text-secondary transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-35"><Trash2 size={16} />Quitar</button></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Field label="Nombre"><input value={variant.name || ""} onChange={(event) => updateVariant(variantIndex, "name", event.target.value)} className={inputClass} /></Field><Field label="Precio"><input required type="number" min="0" step="0.01" value={variant.price} onChange={(event) => updateVariant(variantIndex, "price", event.target.value)} className={inputClass} /></Field><Field label="Stock disponible"><input required type="number" min="0" value={variant.stock_available} onChange={(event) => updateVariant(variantIndex, "stock_available", event.target.value)} className={inputClass} /></Field><Field label="Stock reservado"><input required type="number" min="0" value={variant.stock_reserved} onChange={(event) => updateVariant(variantIndex, "stock_reserved", event.target.value)} className={inputClass} /></Field><label className="flex items-end gap-2 pb-3 text-sm font-medium"><input type="checkbox" checked={variant.active} onChange={(event) => updateVariant(variantIndex, "active", event.target.checked)} className="size-4 accent-primary" />Variante activa</label></div><div className="mt-5 border-t border-border pt-4"><div className="flex items-center justify-between"><p className="text-sm font-semibold">Opciones</p><button type="button" onClick={() => updateVariant(variantIndex, "options", [...variant.options, { option_type_id: "", value: "", code: "" }])} className="inline-flex items-center gap-1 text-sm font-semibold text-primary"><Plus size={15} />Agregar opción</button></div><div className="mt-3 space-y-2">{variant.options.map((option, optionIndex) => <div key={option.id ?? `option-${optionIndex}`} className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]"><select value={option.option_type_id} onChange={(event) => updateOption(variantIndex, optionIndex, "option_type_id", event.target.value)} className={inputClass}><option value="">Tipo de opción</option>{metadata.option_types.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}</select><input placeholder="Valor, ej. Negro" value={option.value} onChange={(event) => updateOption(variantIndex, optionIndex, "value", event.target.value)} className={inputClass} /><input placeholder="Código, ej. negro" value={option.code} onChange={(event) => updateOption(variantIndex, optionIndex, "code", event.target.value)} className={inputClass} /><button type="button" onClick={() => updateVariant(variantIndex, "options", variant.options.filter((_, index) => index !== optionIndex))} className="p-2 text-text-secondary transition hover:text-red-700"><Trash2 size={17} /></button></div>)}{!variant.options.length && <p className="text-sm text-text-secondary">Esta variante no tiene opciones configuradas.</p>}</div></div></div>)}</div></section>
        </div>
        <aside className="h-fit space-y-6 lg:sticky lg:top-6"><section className="rounded-2xl border border-border bg-white p-6 shadow-sm"><h2 className="font-semibold">Publicación destacada</h2><p className="mt-2 text-sm leading-6 text-text-secondary">Indicá una posición si querés mostrar este producto en destacados. Dejalo vacío para quitarlo.</p><label className="mt-5 block"><span className="mb-2 block text-sm font-medium">Posición</span><input type="number" min="1" value={product.featured_position} onChange={(event) => updateProductField("featured_position", event.target.value)} placeholder="Ej. 1" className={inputClass} /></label></section><section className="rounded-2xl border border-border bg-white p-6 shadow-sm"><h2 className="font-semibold">Identificadores controlados</h2>{productId ? <dl className="mt-4 space-y-3 text-sm"><div><dt className="text-text-secondary">Código interno</dt><dd className="mt-1 font-mono font-semibold text-text">{product.code}</dd></div><div><dt className="text-text-secondary">Slug público</dt><dd className="mt-1 break-all font-mono font-semibold text-text">{product.slug}</dd></div></dl> : <p className="mt-3 text-sm leading-6 text-text-secondary">Al guardar se genera un código como <span className="font-mono font-semibold">VAL-SIL-NOR-000123</span>. Los SKU suman las opciones de cada variante, por ejemplo <span className="font-mono font-semibold">COL-BEI</span>.</p>}<p className="mt-4 text-xs leading-5 text-text-secondary">Los identificadores se mantienen estables al editar, para proteger enlaces y registros previos.</p></section><section className="rounded-2xl border border-border bg-white p-6 shadow-sm"><h2 className="font-semibold">Cómo se guarda</h2><ul className="mt-4 space-y-3 text-sm leading-6 text-text-secondary"><li>• Quitar una variante la archiva para preservar pedidos anteriores.</li><li>• Archivar el producto lo oculta del catálogo público.</li><li>• Las imágenes se guardan en el servidor al cargarlas.</li></ul></section></aside>
      </form>
    </main>
  );
};

const OptionTypesManager = ({ onClose }) => {
  const [optionTypes, setOptionTypes] = useState([]);
  const [form, setForm] = useState({ name: "", code: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const metadata = await getMetadata();
        if (active) setOptionTypes(metadata.option_types);
      } catch (requestError) {
        if (active) setError(requestError.message || "No se pudieron cargar los tipos de variante.");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    const name = form.name.trim();
    const code = form.code.trim().toUpperCase();
    if (!name || !code) {
      setError("Indicá un nombre y un código para el tipo de variante.");
      return;
    }
    if (!/^[A-Z0-9]{2,12}$/.test(code)) {
      setError("El código debe tener entre 2 y 12 letras o números.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const optionType = await createOptionType({ name, code });
      setOptionTypes((current) => [...current, optionType].sort((first, second) => (first.sort_order ?? 0) - (second.sort_order ?? 0) || first.name.localeCompare(second.name)));
      setForm({ name: "", code: "" });
    } catch (requestError) {
      setError(requestError.message || "No se pudo crear el tipo de variante.");
    } finally {
      setSaving(false);
    }
  };

  return <main className="mx-auto w-full max-w-4xl px-2 py-6 text-text sm:px-6 lg:py-10"><button type="button" onClick={onClose} className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition hover:text-primary"><ArrowLeft size={16} />Volver a productos</button><p className="mt-5 text-sm font-bold uppercase tracking-[0.26em] text-primary">Administración · Catálogo</p><h1 className="mt-2 text-3xl font-semibold">Tipos de variantes</h1><p className="mt-2 max-w-2xl text-text-secondary">Definí los tipos reutilizables que después se eligen al editar una variante, como Color, Tamaño o Material.</p>{error && <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<section className="mt-8 rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6"><h2 className="font-semibold">Nuevo tipo</h2><form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-[1fr_11rem_auto]"><Field label="Nombre"><input required maxLength="80" placeholder="Ej. Color" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value, code: current.code || optionCodeFromName(event.target.value) }))} className={inputClass} /></Field><Field label="Código"><input required minLength="2" maxLength="12" pattern="[A-Za-z0-9]{2,12}" placeholder="Ej. COL" value={form.code} onChange={(event) => setForm((current) => ({ ...current, code: event.target.value.toUpperCase() }))} className={inputClass} /></Field><div className="flex items-end"><button type="submit" disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-background-dark px-4 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-wait disabled:opacity-60"><Plus size={18} />{saving ? "Guardando…" : "Agregar tipo"}</button></div></form><p className="mt-3 text-xs leading-5 text-text-secondary">El código se guarda en mayúsculas y sólo admite letras y números. Se usa para generar el SKU de las variantes.</p></section><section className="mt-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm"><div className="border-b border-border px-5 py-4 sm:px-6"><h2 className="font-semibold">Tipos disponibles</h2></div>{loading ? <p className="p-6 text-sm text-text-secondary">Cargando tipos…</p> : <ul className="divide-y divide-border">{optionTypes.map((optionType) => <li key={optionType.id} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"><span className="font-medium">{optionType.name}</span><code className="rounded bg-background px-2 py-1 text-sm font-semibold text-text-secondary">{optionType.code}</code></li>)}{!optionTypes.length && <li className="p-6 text-sm text-text-secondary">Todavía no hay tipos. Creá el primero para poder usarlo en las variantes.</li>}</ul>}</section></main>;
};

const ProductList = ({ onCreate, onEdit }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadProducts = useCallback(() => {
    setLoading(true);
    setError("");
    getProducts()
      .then(setProducts)
      .catch((requestError) => setError(requestError.message || "No se pudieron cargar los productos."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);
  const visibleProducts = useMemo(() => products.filter((product) => `${product.name} ${product.code} ${product.slug}`.toLowerCase().includes(search.toLowerCase())), [products, search]);
  const archive = async (product) => { if (!window.confirm(`¿Archivar “${product.name}”? Dejará de aparecer en el catálogo.`)) return; try { await archiveProduct(product.id); loadProducts(); } catch (requestError) { setError(requestError.message || "No se pudo archivar el producto."); } };

  return <main className="mx-auto w-full max-w-7xl px-2 py-6 text-text sm:px-6 lg:py-10"><div className="flex flex-wrap items-end justify-between gap-4"><div><Link to="/panel" className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition hover:text-primary"><ArrowLeft size={16} />Panel</Link><p className="mt-5 text-sm font-bold uppercase tracking-[0.26em] text-primary">Administración · Catálogo</p><h1 className="mt-2 text-3xl font-semibold">Productos</h1><p className="mt-2 text-text-secondary">Creá y mantené todo el catálogo desde un solo lugar.</p></div><button type="button" onClick={onCreate} className="inline-flex items-center gap-2 rounded-xl bg-background-dark px-5 py-3 font-semibold text-white transition hover:bg-primary-dark"><Plus size={18} />Nuevo producto</button></div>{error && <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<div className="mt-8 rounded-2xl border border-border bg-white p-3 shadow-sm"><div className="relative"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, código o slug" className="w-full rounded-xl bg-background py-3 pl-10 pr-4 text-sm outline-none ring-primary transition focus:ring-2" /></div></div>{loading ? <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-52 animate-pulse rounded-2xl bg-primary-light/35" />)}</div> : <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{visibleProducts.map((product) => <article key={product.id} className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"><div className="flex gap-4 p-4"><img src={product.image_url || "https://placehold.co/160x160/f4ede3/3e2c23?text=Producto"} alt={product.name} className="size-20 rounded-xl bg-background object-cover" /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><p className={`text-xs font-bold uppercase tracking-[0.16em] ${product.active ? "text-primary" : "text-text-secondary"}`}>{product.active ? "Publicado" : "Archivado"}</p><h2 className="mt-1 truncate font-semibold">{product.name}</h2></div><span className="text-sm font-semibold text-text-secondary">{product.price_from === null ? "—" : `$${formatPrice(product.price_from)}`}</span></div><p className="mt-2 text-sm text-text-secondary">{product.code} · {product.variants_count} variantes</p></div></div><div className="flex border-t border-border"><button type="button" onClick={() => onEdit(product.id)} className="flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition hover:bg-background"><Pencil size={16} />Editar</button><button type="button" disabled={!product.active} onClick={() => archive(product)} className="flex items-center justify-center gap-2 border-l border-border px-4 py-3 text-sm font-semibold text-text-secondary transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-35"><Archive size={16} />Archivar</button></div></article>)}{!visibleProducts.length && <div className="col-span-full rounded-2xl border border-dashed border-border bg-white p-10 text-center text-text-secondary">No hay productos que coincidan con la búsqueda.</div>}</div>}</main>;
};

const AdminProductsMain = ({ variantTypesOnly = false }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [editingProductId, setEditingProductId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  if (isLoading) return <main className="flex min-h-[34rem] items-center justify-center text-text-secondary">Comprobando acceso administrativo…</main>;
  if (!user || user.role !== "admin") return <Navigate to="/panel" replace />;
  if (variantTypesOnly) return <OptionTypesManager onClose={() => navigate("/panel/configuracion-catalogo")} />;
  if (isCreating || editingProductId) return <ProductEditor productId={editingProductId} onClose={() => { setIsCreating(false); setEditingProductId(null); }} onSaved={() => { setIsCreating(false); setEditingProductId(null); }} />;
  return <ProductList onCreate={() => setIsCreating(true)} onEdit={setEditingProductId} />;
};

export default AdminProductsMain;
