"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Upload, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { createActivity, updateActivity, createActivityCategory } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SelectField } from "@/components/ui/select-field";
import type { Activity, ActivityCategory, Promotion } from "@/types";

const NEW_TYPE_VALUE = "__new__";

interface ActivityFormProps {
  activity?: Activity;
  promotions: Promotion[] | { id: string; name: string }[];
  categories: ActivityCategory[];
  onSuccess?: () => void;
}

export function ActivityForm({ activity, promotions, categories: initialCategories, onSuccess }: ActivityFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = !!activity;

  // Local categories list (grows when user adds a new one)
  const [categories, setCategories] = useState<ActivityCategory[]>(initialCategories);

  const [formData, setFormData] = useState({
    title: activity?.title || "",
    description: activity?.description || "",
    promoId: activity?.promo_id || (promotions.length > 0 ? promotions[0].id : ""),
    categoryId: activity?.category_id || "",
    date: activity?.date ? new Date(activity.date).toISOString().split("T")[0] : "",
    image: null as File | null,
    existingImage: activity?.image_url || null,
    removeImage: false,
  });

  // State for "new type" mode
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, startCreatingCategory] = useTransition();

  const imagePreview = useMemo(
    () => (formData.image ? URL.createObjectURL(formData.image) : null),
    [formData.image]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0], removeImage: false });
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null, existingImage: null, removeImage: true });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === NEW_TYPE_VALUE) {
      setIsNewCategory(true);
      setFormData({ ...formData, categoryId: "" });
    } else {
      setIsNewCategory(false);
      setFormData({ ...formData, categoryId: val });
    }
  };

  /** Crée un nouveau type et le sélectionne automatiquement */
  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error("Saisissez un nom pour le nouveau type.");
      return;
    }
    startCreatingCategory(async () => {
      const result = await createActivityCategory(newCategoryName);
      if (result.success && result.category) {
        const newCat = result.category as ActivityCategory;
        setCategories((prev) => {
          // Éviter les doublons
          if (prev.some((c) => c.id === newCat.id)) return prev;
          return [...prev, newCat];
        });
        setFormData((prev) => ({ ...prev, categoryId: newCat.id }));
        setIsNewCategory(false);
        setNewCategoryName("");
        toast.success(`Type "${newCat.name}" créé et sélectionné !`);
      } else {
        toast.error(result.error || "Erreur lors de la création.");
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isNewCategory) {
      toast.error("Veuillez valider le nouveau type avant de soumettre.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("promoId", formData.promoId);
    data.append("categoryId", formData.categoryId);
    data.append("date", formData.date);
    if (formData.existingImage) data.append("existingImage", formData.existingImage);
    if (formData.image) data.append("image", formData.image);
    if (formData.removeImage) data.append("removeImage", "true");

    startTransition(async () => {
      const result = isEditing
        ? await updateActivity(activity!.id, data)
        : await createActivity(data);

      if (result.success) {
        toast.success(isEditing ? "Activité mise à jour !" : "Activité créée !");
        onSuccess?.();
        router.refresh();
      } else {
        toast.error(result.error || "Une erreur est survenue.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre de l&apos;activité</Label>
          <Input
            id="title"
            placeholder="Ex: Hackathon STIC 2024"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <SelectField
            id="promoId"
            label="Promotion"
            value={formData.promoId}
            onChange={(e) => setFormData({ ...formData, promoId: e.target.value })}
            required
          >
            {promotions.map((promo) => (
              <option key={promo.id} value={promo.id}>
                {promo.name}
              </option>
            ))}
          </SelectField>
        </div>

        {/* Category Field */}
        <div className="space-y-2">
          <Label htmlFor="categoryId">Type d&apos;activité</Label>

          {!isNewCategory ? (
            <div className="relative">
              <select
                id="categoryId"
                value={formData.categoryId || ""}
                onChange={handleCategoryChange}
                className="block w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:bg-white focus:ring-4 focus:ring-[var(--aduti-primary)]/10 focus:border-[var(--aduti-primary)] transition-all text-sm font-medium appearance-none"
              >
                <option value="">— Sélectionner un type (optionnel) —</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
                <option value={NEW_TYPE_VALUE}>✦ Ajouter un nouveau type…</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Nom du nouveau type (ex: Conférence Tech)"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                autoFocus
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleCreateCategory(); } }}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleCreateCategory}
                disabled={isCreatingCategory}
                className="h-10 px-4 rounded-xl bg-[var(--aduti-primary)] text-white text-sm font-bold shrink-0"
              >
                {isCreatingCategory ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => { setIsNewCategory(false); setNewCategoryName(""); }}
                className="h-10 px-3 rounded-xl text-slate-500 shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
          <p className="text-[10px] text-slate-400 font-medium ml-1">
            {isNewCategory
              ? "Tapez le nom et cliquez + pour valider. Appuyez sur Entrée pour confirmer."
              : "Choisissez un type ou ajoutez-en un nouveau."}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date de l&apos;événement (Optionnel)</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full"
          />
          <p className="text-[10px] text-slate-400 font-medium">Laissez vide pour utiliser la date de publication actuelle.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Détails de l'événement..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="min-h-[120px]"
            required
          />
        </div>

        {/* Image section */}
        <div className="space-y-3">
          <Label>Image illustrative</Label>
          
          {(formData.existingImage || imagePreview) ? (
            <div className="relative aspect-video rounded-2xl overflow-hidden group border-2 border-slate-100 bg-slate-50">
              <Image 
                src={imagePreview || formData.existingImage!} 
                alt="Preview" 
                fill 
                className="object-cover" 
                unoptimized={!!imagePreview} 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => document.getElementById("image-upload")?.click()}
                  className="rounded-full h-9"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Changer
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeImage}
                  className="rounded-full h-9"
                >
                  <X className="w-4 h-4 mr-2" />
                  Supprimer
                </Button>
              </div>
              {imagePreview && (
                <div className="absolute top-2 left-2 bg-[var(--aduti-primary)] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-lg">
                  Nouveau
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => document.getElementById("image-upload")?.click()}
              className="w-full border-2 border-dashed border-slate-200 rounded-2xl h-32 flex flex-col items-center justify-center gap-2 hover:border-[var(--aduti-primary)]/40 hover:bg-blue-50/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                <Upload className="w-5 h-5 text-slate-400 group-hover:text-[var(--aduti-primary)] transition-colors" />
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-[var(--aduti-primary)] transition-colors">
                Ajouter une photo illustrative
              </span>
            </button>
          )}

          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="submit"
          disabled={isPending || isNewCategory}
          className="bg-[var(--aduti-primary)] hover:bg-blue-600 text-white px-8 h-12 rounded-xl"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : isEditing ? "Mettre à jour" : "Publier l'activité"}
        </Button>
      </div>
    </form>
  );
}
