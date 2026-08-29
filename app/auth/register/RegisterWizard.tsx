"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Loader2, Upload, X } from "lucide-react";

import { FieldLabel, fieldClass, fieldErrorClass } from "./FieldLabel";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { MAX_IMAGE_SIZE, ALLOWED_IMAGE_TYPES } from "@/lib/image-upload";
import {
  registerSchema,
  registerRequestSchema,
  type RegisterInput,
  type RegisterRequestInput,
} from "@/schemas/auth.schema";
import { signup, requestRegistration } from "@/app/auth/actions";

type Mode = "invitation" | "request";
type FormValues = RegisterInput & RegisterRequestInput;

interface Step {
  id: string;
  title: string;
  /** Champs valides avant de pouvoir avancer. */
  fields: (keyof FormValues)[];
}

const IDENTITY: Step = {
  id: "identity",
  title: "Identité",
  fields: ["first_name", "last_name", "email", "gender"],
};
const PATH: Step = { id: "path", title: "Parcours", fields: ["promo_id", "status"] };
const PHOTO: Step = { id: "photo", title: "Photo", fields: [] };
const SECURITY: Step = {
  id: "security",
  title: "Mot de passe",
  fields: ["password", "confirmPassword"],
};
const REVIEW: Step = { id: "review", title: "Validation", fields: [] };

export function RegisterWizard({
  mode,
  token,
  promotions,
  loadingPromos,
}: {
  mode: Mode;
  token: string;
  promotions: { id: string; name: string }[];
  loadingPromos: boolean;
}) {
  const steps = useMemo<Step[]>(
    () =>
      mode === "invitation"
        ? [IDENTITY, PATH, PHOTO, SECURITY, REVIEW]
        : [IDENTITY, PATH, PHOTO, REVIEW],
    [mode]
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const schema = mode === "invitation" ? registerSchema : registerRequestSchema;

  const {
    register,
    handleSubmit,
    control,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    // Le schema depend du parcours : celui de la demande n'a ni password ni
    // confirmPassword, absents du formulaire dans ce mode.
    resolver: zodResolver(schema) as unknown as Resolver<FormValues>,
    mode: "onBlur",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      promo_id: "",
      status: "" as "STUDENT" | "ALUMNI",
      gender: "" as "MALE" | "FEMALE",
      profile_status: "PUBLIC",
    },
    shouldUnregister: false,
  });

  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  async function goNext() {
    const valid =
      step.fields.length === 0 || (await trigger(step.fields, { shouldFocus: true }));
    if (!valid) return;
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function onPhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
      toast.error("Format non accepté. Utilisez JPEG, PNG ou WebP.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("L’image ne doit pas dépasser 5 Mo.");
      return;
    }
    setPhoto(file);
    setPhotoPreview((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return URL.createObjectURL(file);
    });
  }

  function clearPhoto() {
    setPhoto(null);
    setPhotoPreview((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return null;
    });
    if (fileInput.current) fileInput.current.value = "";
  }

  function submit(values: FormValues) {
    if (process.env.NODE_ENV === "production" && !captchaToken) {
      toast.error("Veuillez valider le captcha.");
      return;
    }

    startTransition(async () => {
      if (mode === "invitation") {
        const result = await signup({ ...values, token, captchaToken: captchaToken ?? "" });
        if (result?.error) toast.error(result.error);
        return;
      }

      const payload = new FormData();
      payload.set("first_name", values.first_name);
      payload.set("last_name", values.last_name);
      payload.set("email", values.email);
      payload.set("promo_id", values.promo_id);
      payload.set("status", values.status);
      payload.set("gender", values.gender);
      payload.set("profile_status", values.profile_status ?? "PUBLIC");
      payload.set("captchaToken", captchaToken ?? "");
      if (photo) payload.set("photo", photo);

      const result = await requestRegistration(payload);
      if ("error" in result && result.error) {
        toast.error(result.error);
        return;
      }
      window.location.href = "/auth/pending-review";
    });
  }

  const values = getValues();
  const promoName = promotions.find((p) => p.id === values.promo_id)?.name;

  return (
    <div>
      <ol className="mb-8 flex items-center gap-2" aria-label="Progression du formulaire">
        {steps.map((s, i) => (
          <li key={s.id} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                i <= stepIndex
                  ? "bg-[var(--aduti-primary)] text-white"
                  : "bg-slate-100 text-slate-400"
              )}
              aria-current={i === stepIndex ? "step" : undefined}
            >
              {i < stepIndex ? <Check className="size-4" /> : i + 1}
            </span>
            <span
              className={cn(
                "hidden text-xs font-medium sm:block",
                i === stepIndex ? "text-slate-900" : "text-slate-400"
              )}
            >
              {s.title}
            </span>
            {i < steps.length - 1 && <span className="h-px flex-1 bg-slate-200" aria-hidden />}
          </li>
        ))}
      </ol>

      <form onSubmit={handleSubmit(submit)} className="space-y-6" noValidate>
        {step.id === "identity" && (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="first_name" required>
                  Prénom
                </FieldLabel>
                <input
                  id="first_name"
                  className={cn(fieldClass, errors.first_name && fieldErrorClass)}
                  disabled={isPending}
                  {...register("first_name")}
                />
                {errors.first_name && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.first_name.message}</p>
                )}
              </div>
              <div>
                <FieldLabel htmlFor="last_name" required>
                  Nom
                </FieldLabel>
                <input
                  id="last_name"
                  className={cn(fieldClass, errors.last_name && fieldErrorClass)}
                  disabled={isPending}
                  {...register("last_name")}
                />
                {errors.last_name && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="email" required>
                Adresse email
              </FieldLabel>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={cn(fieldClass, errors.email && fieldErrorClass)}
                disabled={isPending}
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <FieldLabel htmlFor="gender" required>
                Genre
              </FieldLabel>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Combobox
                    options={[
                      { value: "MALE", label: "Masculin" },
                      { value: "FEMALE", label: "Féminin" },
                    ]}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="Sélectionner"
                    searchPlaceholder="Rechercher..."
                    emptyMessage="Aucun résultat."
                  />
                )}
              />
              {errors.gender && (
                <p className="mt-1.5 text-xs text-red-600">{errors.gender.message}</p>
              )}
            </div>
          </div>
        )}

        {step.id === "path" && (
          <div className="space-y-5">
            <div>
              <FieldLabel htmlFor="promo_id" required>
                Année de promotion
              </FieldLabel>
              <Controller
                name="promo_id"
                control={control}
                render={({ field }) => (
                  <Combobox
                    options={promotions.map((p) => ({ value: p.id, label: p.name }))}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder={loadingPromos ? "Chargement..." : "Sélectionner"}
                    searchPlaceholder="Rechercher une année..."
                    emptyMessage="Aucune promotion trouvée."
                  />
                )}
              />
              {errors.promo_id && (
                <p className="mt-1.5 text-xs text-red-600">{errors.promo_id.message}</p>
              )}
            </div>

            <div>
              <FieldLabel htmlFor="status" required>
                Statut
              </FieldLabel>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Combobox
                    options={[
                      { value: "STUDENT", label: "Étudiant" },
                      { value: "ALUMNI", label: "Alumni" },
                    ]}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="Sélectionner"
                    searchPlaceholder="Rechercher..."
                    emptyMessage="Aucun résultat."
                  />
                )}
              />
              {errors.status && (
                <p className="mt-1.5 text-xs text-red-600">{errors.status.message}</p>
              )}
            </div>
          </div>
        )}

        {step.id === "photo" && (
          <div className="space-y-6">
            <div>
              <FieldLabel htmlFor="photo">Photo de profil</FieldLabel>
              <p className="mb-4 text-sm text-slate-500">
                Facultatif. Vous pourrez l’ajouter ou la changer plus tard depuis votre profil.
              </p>

              <div className="flex items-center gap-5">
                <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                  {photoPreview ? (
                    <Image
                      src={photoPreview}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="flex size-full items-center justify-center text-slate-300">
                      <Upload className="size-7" />
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <input
                    id="photo"
                    ref={fileInput}
                    type="file"
                    accept={ALLOWED_IMAGE_TYPES.join(",")}
                    className="sr-only"
                    onChange={onPhotoChange}
                    disabled={isPending}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl border-slate-300"
                    onClick={() => fileInput.current?.click()}
                    disabled={isPending}
                  >
                    {photo ? "Changer l’image" : "Choisir une image"}
                  </Button>
                  {photo && (
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl border-slate-300"
                      onClick={clearPhoto}
                      disabled={isPending}
                    >
                      <X className="mr-1 size-4" />
                      Retirer
                    </Button>
                  )}
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-400">JPEG, PNG ou WebP, 5 Mo maximum.</p>
            </div>

            <div>
              <FieldLabel htmlFor="profile_status">Visibilité du profil</FieldLabel>
              <Controller
                name="profile_status"
                control={control}
                render={({ field }) => (
                  <Combobox
                    options={[
                      { value: "PUBLIC", label: "Public, visible par les visiteurs" },
                      { value: "PRIVATE", label: "Privé, visible des seuls membres" },
                    ]}
                    value={field.value ?? "PUBLIC"}
                    onChange={field.onChange}
                    placeholder="Sélectionner"
                    searchPlaceholder="Rechercher..."
                    emptyMessage="Aucun résultat."
                  />
                )}
              />
            </div>
          </div>
        )}

        {step.id === "security" && (
          <div className="space-y-5">
            <div>
              <FieldLabel htmlFor="password" required>
                Mot de passe
              </FieldLabel>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={cn(fieldClass, "pr-12", errors.password && fieldErrorClass)}
                  disabled={isPending}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <FieldLabel htmlFor="confirmPassword" required>
                Confirmer le mot de passe
              </FieldLabel>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  className={cn(fieldClass, "pr-12", errors.confirmPassword && fieldErrorClass)}
                  disabled={isPending}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirm ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
        )}

        {step.id === "review" && (
          <div className="space-y-6">
            <dl className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-slate-50/60 px-5">
              {[
                { label: "Nom", value: `${values.last_name?.toUpperCase()} ${values.first_name}` },
                { label: "Email", value: values.email },
                { label: "Promotion", value: promoName ?? "-" },
                { label: "Statut", value: values.status === "ALUMNI" ? "Alumni" : "Étudiant" },
                { label: "Photo", value: photo ? photo.name : "Aucune" },
                {
                  label: "Visibilité",
                  value: values.profile_status === "PRIVATE" ? "Privé" : "Public",
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-start justify-between gap-4 py-3 text-sm"
                >
                  <dt className="text-slate-500">{row.label}</dt>
                  <dd className="text-right font-medium text-slate-900">{row.value}</dd>
                </div>
              ))}
            </dl>

            {mode === "request" && (
              <p className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-600">
                Un administrateur examinera votre demande. Une fois approuvée, vous
                recevrez un email contenant un lien pour définir votre mot de passe.
              </p>
            )}

            {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
              <div className="flex justify-center">
                <Turnstile
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                  onSuccess={setCaptchaToken}
                  options={{ theme: "light", size: "normal" }}
                />
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            disabled={stepIndex === 0 || isPending}
            className="h-12 rounded-2xl border-slate-300 px-6 font-semibold text-slate-700 disabled:opacity-40"
          >
            <ArrowLeft className="mr-2 size-4" />
            Précédent
          </Button>

          {isLast ? (
            <Button
              type="submit"
              disabled={isPending}
              className="h-12 rounded-2xl bg-[var(--aduti-primary)] px-8 font-bold text-white transition-colors hover:bg-[var(--aduti-primary-hover)]"
            >
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {mode === "request" ? "Soumettre la demande" : "Créer mon compte"}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={goNext}
              disabled={isPending}
              className="h-12 rounded-2xl bg-[var(--aduti-primary)] px-8 font-bold text-white transition-colors hover:bg-[var(--aduti-primary-hover)]"
            >
              Suivant
              <ArrowRight className="ml-2 size-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
