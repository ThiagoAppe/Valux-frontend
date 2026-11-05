import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LogOut, Mail, MapPin, Save, UserRound } from "lucide-react";
import OrdersTab from "./ordersTab";
import Modal from "../../components/modal/modal";
import useAuth from "../../context/useAuth";
import { resendVerification } from "../../services/authService";
import { createAddress, getAddresses, requestEmailChange, updateAddress, updateProfile } from "../../services/profileService";

const emptyProfile = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  street: "",
  city: "",
  province: "",
  postalCode: "",
  country: "Argentina",
};

const profileFromUser = (user) => {
  return {
    ...emptyProfile,
    email: user.email,
    firstName: user.first_name ?? "",
    lastName: user.last_name ?? "",
    phone: user.phone ?? "",
  };
};

const Field = ({ label, name, value, onChange, type = "text", autoComplete, required = false, disabled = false, minLength }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-medium text-text">{label}</span>
    <input type={type} name={name} value={value} onChange={onChange} autoComplete={autoComplete} required={required} disabled={disabled} minLength={minLength} className="w-full rounded-xl border border-border bg-white px-4 py-3 text-text outline-none transition placeholder:text-text-secondary/60 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-neutral-100" />
  </label>
);

const primaryButton = "w-full rounded-xl bg-background-dark px-5 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-wait disabled:opacity-60";
const secondaryButton = "w-full rounded-xl border border-border bg-white px-5 py-3 font-medium text-text transition hover:border-primary hover:text-primary disabled:cursor-wait disabled:opacity-60";

const VerificationNotice = ({ email, kind, onResend, onClose, isSubmitting, message, error }) => (
  <Modal title={kind === "registered" ? "Revisá tu correo" : "Confirmá tu email"} icon={<Mail size={25} />} onClose={onClose}>
    <p className="mt-3 text-text-secondary">
      {kind === "registered"
        ? <>Te enviamos un email a <strong className="text-text">{email}</strong>. Abrí el enlace que contiene para confirmar tu cuenta; después vas a poder iniciar sesión.</>
        : <>Tu cuenta todavía no está confirmada. Te enviamos un email a <strong className="text-text">{email}</strong> con el enlace para activarla; si no lo encontrás, pedí uno nuevo.</>}
    </p>
    <p className="mt-3 text-sm text-text-secondary">Si no lo ves, revisá la carpeta de spam. El enlace vence en 24 horas.</p>
    {message && <p aria-live="polite" className="mt-4 rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary-dark">{message}</p>}
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    <div className="mt-6 grid gap-3">
      <button type="button" onClick={onClose} className={primaryButton}>Entendido</button>
      <button type="button" onClick={onResend} disabled={isSubmitting} className={secondaryButton}>{isSubmitting ? "Enviando…" : "Reenviar correo"}</button>
    </div>
  </Modal>
);

const EmailChange = ({ currentEmail }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [sentTo, setSentTo] = useState("");

  const open = () => {
    setSentTo("");
    setError("");
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setNewEmail("");
    setPassword("");
    setError("");
    setSentTo("");
  };

  const submit = async (event) => {
    // El modal se monta en un portal dentro del formulario del perfil:
    // evitar que el envío llegue a ese formulario.
    event.preventDefault();
    event.stopPropagation();
    setError("");
    setIsSending(true);
    try {
      await requestEmailChange({ new_email: newEmail.trim(), password });
      setSentTo(newEmail.trim());
      setNewEmail("");
      setPassword("");
    } catch (requestError) {
      setError(requestError.message || "No se pudo iniciar el cambio de email.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="sm:col-span-2">
      <Field label="Email" name="email" type="email" value={currentEmail} onChange={() => {}} autoComplete="email" disabled />
      <button type="button" onClick={open} className="mt-2 text-sm font-medium text-primary underline">Cambiar email</button>

      {isOpen && !sentTo && (
        <Modal title="Cambiar email" icon={<Mail size={25} />} onClose={close}>
          <p className="mt-3 text-text-secondary">Te enviaremos un enlace al nuevo email. El cambio se aplica cuando lo confirmes; hasta entonces seguís ingresando con <strong className="text-text">{currentEmail}</strong>.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field label="Nuevo email" name="newEmail" type="email" value={newEmail} onChange={(event) => { setNewEmail(event.target.value); setError(""); }} autoComplete="off" required />
            <Field label="Tu contraseña actual" name="emailChangePassword" type="password" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} autoComplete="current-password" required />
            {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            <div className="grid gap-3 pt-2">
              <button type="submit" disabled={isSending} className={primaryButton}>{isSending ? "Enviando…" : "Enviar confirmación"}</button>
              <button type="button" onClick={close} className={secondaryButton}>Cancelar</button>
            </div>
          </form>
        </Modal>
      )}

      {isOpen && sentTo && (
        <Modal title="Revisá tu correo" icon={<Mail size={25} />} onClose={close}>
          <p className="mt-3 text-text-secondary">Te enviamos un email a <strong className="text-text">{sentTo}</strong>. Abrí el enlace para confirmar el cambio; tu email actual no cambia hasta entonces.</p>
          <p className="mt-3 text-sm text-text-secondary">Si no lo ves, revisá la carpeta de spam. El enlace vence en 24 horas.</p>
          <div className="mt-6"><button type="button" onClick={close} className={primaryButton}>Entendido</button></div>
        </Modal>
      )}
    </div>
  );
};

const AuthenticationForm = ({ sessionError, returnTo }) => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [noticeKind, setNoticeKind] = useState("registered");

  const resend = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);
    try {
      await resendVerification(pendingEmail);
      setSuccessMessage("Listo, te enviamos un nuevo correo. Puede tardar un minuto.");
    } catch (error) {
      setErrorMessage(error.message || "No se pudo reenviar el correo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrorMessage("");
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setErrorMessage("");
    setSuccessMessage("");
    setPendingEmail("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setPendingEmail("");
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
        if (returnTo) navigate(returnTo);
      } else {
        await register({
          email: form.email,
          password: form.password,
          first_name: form.firstName,
          last_name: form.lastName,
          phone: form.phone || null,
        });
        // La cuenta debe confirmarse por email antes de poder iniciar sesión.
        setNoticeKind("registered");
        setPendingEmail(form.email);
      }
    } catch (error) {
      if (mode === "login" && error.status === 403) {
        // Cuenta sin confirmar: es un aviso, no un error.
        setNoticeKind("unverified");
        setPendingEmail(form.email);
      } else {
        setErrorMessage(error.message || "No se pudo completar la solicitud.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeNotice = () => {
    setPendingEmail("");
    setMode("login");
    setErrorMessage("");
    setSuccessMessage("");
    setForm((current) => ({ ...current, password: "" }));
  };

  return (
    <main className="mx-auto flex w-full max-w-md flex-col justify-center px-2 py-10 text-text sm:px-6 lg:min-h-[38rem]">
      <div className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><UserRound size={25} /></div>
        <p className="mt-6 text-sm uppercase tracking-[0.2em] text-text-secondary">Mi cuenta</p>
        <h1 className="mt-2 text-3xl font-semibold">{mode === "login" ? "Ingresá a Valux Deco" : "Creá tu cuenta"}</h1>
        <p className="mt-3 text-text-secondary">{mode === "login" ? "Accedé para completar tus datos y agilizar futuras compras." : "Registrate con tus datos para empezar a comprar."}</p>

        <div className="mt-6 grid grid-cols-2 rounded-xl bg-neutral-100 p-1" aria-label="Elegir acceso o registro">
          <button type="button" onClick={() => changeMode("login")} className={`rounded-lg px-3 py-2 text-sm font-medium transition ${mode === "login" ? "bg-white text-text shadow-sm" : "text-text-secondary"}`}>Ingresar</button>
          <button type="button" onClick={() => changeMode("register")} className={`rounded-lg px-3 py-2 text-sm font-medium transition ${mode === "register" ? "bg-white text-text shadow-sm" : "text-text-secondary"}`}>Registrarme</button>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "register" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre" name="firstName" value={form.firstName} onChange={updateField} autoComplete="given-name" required />
              <Field label="Apellido" name="lastName" value={form.lastName} onChange={updateField} autoComplete="family-name" required />
            </div>
          )}
          <Field label="Email" name="email" type="email" value={form.email} onChange={updateField} autoComplete="email" required />
          {mode === "register" && <Field label="Teléfono (opcional)" name="phone" type="tel" value={form.phone} onChange={updateField} autoComplete="tel" />}
          <Field label="Contraseña" name="password" type="password" value={form.password} onChange={updateField} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={mode === "register" ? 8 : undefined} required />
          {mode === "register" && <p className="text-xs text-text-secondary">Usá al menos 8 caracteres.</p>}
          <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-background-dark px-5 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-wait disabled:opacity-60">{isSubmitting ? "Procesando…" : mode === "login" ? "Ingresar con email" : "Crear cuenta"}</button>
        </form>

        {(errorMessage || sessionError) && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage || sessionError}</p>}
        {successMessage && <p aria-live="polite" className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{successMessage}</p>}

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-text-secondary"><span className="h-px flex-1 bg-border" />o<span className="h-px flex-1 bg-border" /></div>
        <button type="button" disabled title="Google Sign-In no forma parte de esta etapa." className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-border px-5 py-3 font-medium text-text-secondary opacity-60"><GoogleMark />Continuar con Google próximamente</button>
      </div>

      {pendingEmail && (
        <VerificationNotice
          email={pendingEmail}
          kind={noticeKind}
          onResend={resend}
          onClose={closeNotice}
          isSubmitting={isSubmitting}
          message={successMessage}
          error={errorMessage}
        />
      )}
    </main>
  );
};

const TABS = [
  { id: "datos", label: "Mis datos" },
  { id: "compras", label: "Mis compras" },
];

const AuthenticatedProfile = ({ user, logout, updateCurrentUser, returnTo }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = TABS.some((tab) => tab.id === searchParams.get("tab")) ? searchParams.get("tab") : "datos";
  const selectTab = (tabId) => {
    const next = new URLSearchParams(searchParams);
    if (tabId === "datos") next.delete("tab"); else next.set("tab", tabId);
    setSearchParams(next, { replace: true });
  };
  const [profile, setProfile] = useState(() => profileFromUser(user));
  const [savedMessage, setSavedMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [addressId, setAddressId] = useState(null);

  useEffect(() => {
    let active = true;

    getAddresses()
      .then((addresses) => {
        if (!active) return;
        const address = addresses.find((item) => item.is_default) ?? addresses[0];
        if (!address) return;

        setAddressId(address.id);
        setProfile((current) => ({
          ...current,
          street: address.street,
          city: address.city,
          province: address.province,
          postalCode: address.postal_code,
          country: address.country,
        }));
      })
      .catch((error) => {
        if (active && error.status !== 401) setErrorMessage("No pudimos cargar tu dirección guardada.");
      })
      .finally(() => {
        if (active) setIsProfileLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user.id]);

  const updateProfileField = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
    setSavedMessage("");
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSavedMessage("");

    const addressValues = {
      street: profile.street.trim(),
      city: profile.city.trim(),
      province: profile.province.trim(),
      postal_code: profile.postalCode.trim(),
      country: profile.country.trim(),
      is_default: true,
    };
    const hasAddressData = Object.values(addressValues).slice(0, 4).some(Boolean);
    const hasCompleteAddress = Object.values(addressValues).slice(0, 5).every(Boolean);

    if (hasAddressData && !hasCompleteAddress) {
      setErrorMessage("Completá todos los campos de dirección o dejalos vacíos.");
      return;
    }

    setIsSaving(true);

    try {
      const updatedUser = await updateProfile({
        first_name: profile.firstName,
        last_name: profile.lastName,
        phone: profile.phone || null,
      });
      updateCurrentUser(updatedUser);

      if (hasCompleteAddress) {
        const savedAddress = addressId
          ? await updateAddress(addressId, addressValues)
          : await createAddress(addressValues);
        setAddressId(savedAddress.id);
      }

      setProfile((current) => ({
        ...current,
        email: updatedUser.email,
        firstName: updatedUser.first_name ?? "",
        lastName: updatedUser.last_name ?? "",
        phone: updatedUser.phone ?? "",
      }));
      setSavedMessage("Tus datos se guardaron correctamente.");
      if (returnTo) navigate(returnTo);
    } catch (error) {
      setErrorMessage(error.message || "No se pudieron guardar tus datos.");
    } finally {
      setIsSaving(false);
    }
  };

  const signOut = async () => {
    setErrorMessage("");
    setIsSigningOut(true);
    try {
      await logout();
      setProfile(emptyProfile);
      setSavedMessage("");
    } catch (error) {
      setErrorMessage(error.message || "No se pudo cerrar la sesión.");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-2 py-6 text-text sm:px-6 lg:py-10">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">Mi cuenta</p>
          <h1 className="mt-2 text-3xl font-semibold">Hola{profile.firstName ? `, ${profile.firstName}` : ""}</h1>
          <p className="mt-2 text-text-secondary">{activeTab === "compras" ? "Seguí el estado de tus pedidos y pedí ayuda cuando la necesites." : "Completá tus datos para que tus próximas compras sean más simples."}</p>
        </div>
        <button type="button" onClick={signOut} disabled={isSigningOut} className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-medium transition hover:border-primary hover:text-primary disabled:opacity-60"><LogOut size={17} />{isSigningOut ? "Cerrando…" : "Cerrar sesión"}</button>
      </div>

      <div role="tablist" aria-label="Secciones de tu cuenta" className="mb-6 flex w-fit max-w-full gap-1.5 overflow-x-auto rounded-2xl border border-border bg-white p-1.5">
        {TABS.map((tab) => (
          <button key={tab.id} type="button" role="tab" id={`tab-${tab.id}`} aria-selected={activeTab === tab.id} aria-controls={`panel-${tab.id}`} onClick={() => selectTab(tab.id)} className={`whitespace-nowrap rounded-xl px-5 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-background-dark text-white shadow-sm" : "text-text-secondary hover:bg-primary-light/30 hover:text-text"}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab === "compras" && <div role="tabpanel" id="panel-compras" aria-labelledby="tab-compras"><OrdersTab /></div>}

      {activeTab === "datos" && errorMessage && <p role="alert" className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>}

      {activeTab === "datos" && <form onSubmit={saveProfile} className="grid gap-6 lg:grid-cols-[1fr_0.72fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3"><div className="rounded-xl bg-primary/10 p-2.5 text-primary"><UserRound size={20} /></div><div><h2 className="font-semibold">Datos personales</h2><p className="text-sm text-text-secondary">Cómo queremos identificarte.</p></div></div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Nombre" name="firstName" value={profile.firstName} onChange={updateProfileField} autoComplete="given-name" required />
              <Field label="Apellido" name="lastName" value={profile.lastName} onChange={updateProfileField} autoComplete="family-name" required />
              <EmailChange currentEmail={user.email} />
              <div className="sm:col-span-2"><Field label="Teléfono" name="phone" type="tel" value={profile.phone} onChange={updateProfileField} autoComplete="tel" /></div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3"><div className="rounded-xl bg-primary/10 p-2.5 text-primary"><MapPin size={20} /></div><div><h2 className="font-semibold">Dirección de entrega</h2><p className="text-sm text-text-secondary">Podrás modificarla al confirmar una compra.</p></div></div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><Field label="Calle y altura" name="street" value={profile.street} onChange={updateProfileField} autoComplete="street-address" /></div>
              <Field label="Ciudad" name="city" value={profile.city} onChange={updateProfileField} autoComplete="address-level2" />
              <Field label="Provincia" name="province" value={profile.province} onChange={updateProfileField} autoComplete="address-level1" />
              <Field label="Código postal" name="postalCode" value={profile.postalCode} onChange={updateProfileField} autoComplete="postal-code" />
              <Field label="País" name="country" value={profile.country} onChange={updateProfileField} autoComplete="country-name" />
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-white p-6 shadow-sm lg:sticky lg:top-6">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">{(profile.firstName || profile.email || "U").slice(0, 1).toUpperCase()}</div>
          <h2 className="mt-4 text-xl font-semibold">{profile.firstName || "Tu perfil"}{profile.lastName ? ` ${profile.lastName}` : ""}</h2>
          <p className="mt-1 flex items-center gap-2 text-sm text-text-secondary"><Mail size={15} />{profile.email}</p>
          <div className="my-6 h-px bg-border" />
          <p className="text-sm leading-6 text-text-secondary">Tus datos personales y dirección se guardan de forma segura en tu cuenta.</p>
          <button type="submit" disabled={isSaving || isProfileLoading} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-background-dark px-5 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-wait disabled:opacity-60"><Save size={18} />{isSaving ? "Guardando…" : isProfileLoading ? "Cargando datos…" : "Guardar datos"}</button>
          {savedMessage && <p aria-live="polite" className="mt-3 text-center text-sm text-green-700">{savedMessage}</p>}
        </aside>
      </form>}
    </main>
  );
};

const ProfileMain = () => {
  const { user, isLoading, logout, sessionError, updateCurrentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const requestedReturnTo = searchParams.get("returnTo");
  const returnTo = requestedReturnTo?.startsWith("/") && !requestedReturnTo.startsWith("//")
    ? requestedReturnTo
    : null;

  if (isLoading) {
    return <main className="mx-auto flex min-h-[38rem] w-full max-w-md items-center justify-center px-6 text-text-secondary" aria-live="polite">Comprobando tu sesión…</main>;
  }

  if (!user) return <AuthenticationForm sessionError={sessionError} returnTo={returnTo} />;

  return <AuthenticatedProfile key={user.id} user={user} logout={logout} updateCurrentUser={updateCurrentUser} returnTo={returnTo} />;
};

const GoogleMark = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
    <path fill="#4285F4" d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5a4.7 4.7 0 0 1-2 3.1v2.5h3.2c1.9-1.8 3.1-4.4 3.1-7.4Z" />
    <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.2-2.5c-.9.6-2 .9-3.5.9-2.7 0-5-1.8-5.8-4.3H2.9v2.6A10 10 0 0 0 12 22Z" />
    <path fill="#FBBC05" d="M6.2 13.7A6 6 0 0 1 5.9 12c0-.6.1-1.2.3-1.7V7.7H2.9A10 10 0 0 0 2 12c0 1.6.4 3.1.9 4.3l3.3-2.6Z" />
    <path fill="#EA4335" d="M12 6c1.6 0 3 .5 4.1 1.6l3.1-3A10 10 0 0 0 2.9 7.7l3.3 2.6C7 7.8 9.3 6 12 6Z" />
  </svg>
);

export default ProfileMain;
