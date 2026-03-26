"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Activity, Promotion } from "@/types";
import { createActivity, updateActivity } from "./actions";

interface ActivityFormProps {
  activity?: Activity;
  promotions: Promotion[] | { id: string; name: string }[];
  onSuccess?: () => void;
}

export function ActivityForm({ activity, promotions, onSuccess }: ActivityFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = !!activity;

  const [formData, setFormData] = useState({
    title: activity?.title || "",
    description: activity?.description || "",
    promoId: activity?.promo_id || (promotions.length > 0 ? promotions[0].id : ""),
    date: activity?.date ? new Date(activity.date).toISOString().split("T")[0] : "",
    image: null as File | null,
    existingImage: activity?.image_url || null,
    removeImage: false,
  });

  const imagePreview = useMemo(
    () => (formData.image ? URL.createObjectURL(formData.image) : null),
    [formData.image]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        image: e.target.files[0],
        removeImage: false,
      });
    }
  };

  const removeImage = () => {
    setFormData({
      ...formData,
      image: null,
      existingImage: null,
      removeImage: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("promoId", formData.promoId);
    data.append("date", formData.date);
    if (formData.existingImage) {
      data.append("existingImage", formData.existingImage);
    }
    if (formData.image) {
      data.append("image", formData.image);
    }
    if (formData.removeImage) {
      data.append("removeImage", "true");
    }

    startTransition(async () => {
      const result = isEditing
        ? await updateActivity(activity!.id, data)
        : await createActivity(data);

      if (result.success) {
        toast.success(isEditing ? "Activité mise à jour !" : "Activité créée !");
        onSuccess?.();
        router.refresh();
      } else {
        toast.error("Une erreur est survenue.");
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
          <Label htmlFor="promoId">Promotion</Label>
          <select
            id="promoId"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.promoId}
            onChange={(e) => setFormData({ ...formData, promoId: e.target.value })}
            required
          >
            {promotions.map((promo) => (
              <option key={promo.id} value={promo.id}>
                {promo.name}
              </option>
            ))}
          </select>
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
          disabled={isPending}
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
