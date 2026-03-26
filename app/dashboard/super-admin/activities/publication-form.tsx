"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, X, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Publication } from "@/types";
import { createPublication, updatePublication } from "./actions";

interface PublicationFormProps {
  publication?: Publication;
  activityId: string;
  onSuccess?: () => void;
}

export function PublicationForm({ publication, activityId, onSuccess }: PublicationFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = !!publication;

  const [formData, setFormData] = useState({
    title: publication?.title || "",
    content: publication?.content || "",
    date: publication?.date ? new Date(publication.date).toISOString().split("T")[0] : "",
    images: [] as File[],
    existingImages: publication?.images || [],
  });

  const imagePreviews = useMemo(
    () => formData.images.map((f) => URL.createObjectURL(f)),
    [formData.images]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, images: [...formData.images, ...Array.from(e.target.files)] });
    }
  };

  const removeNewImage = (idx: number) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) });
  };

  const removeExistingImage = (idx: number) => {
    setFormData({ ...formData, existingImages: formData.existingImages.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("date", formData.date);
    data.append("activityId", activityId);
    data.append("existingImages", JSON.stringify(formData.existingImages));
    formData.images.forEach((f) => data.append("images", f));

    startTransition(async () => {
      const result = isEditing
        ? await updatePublication(publication!.id, data)
        : await createPublication(data);

      if (result.success) {
        toast.success(isEditing ? "Publication mise à jour !" : "Publication créée !");
        onSuccess?.();
        router.refresh();
      } else {
        toast.error("error" in result ? (result as { error: string }).error : "Une erreur est survenue.");
      }
    });
  };

  const totalImages = formData.existingImages.length + formData.images.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="pub-title">Titre</Label>
        <Input
          id="pub-title"
          placeholder="Ex: Affiche officielle du Hackathon"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pub-content">Description (optionnel)</Label>
        <Textarea
          id="pub-content"
          placeholder="Détails de la publication..."
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pub-date">Date (Optionnel)</Label>
        <Input
          id="pub-date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full"
        />
        <p className="text-[10px] text-slate-400 font-medium">Laissez vide pour utiliser la date de l&apos;activité ou de publication.</p>
      </div>

      {/* Images section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Photos {totalImages > 0 && <span className="text-slate-400 font-normal">({totalImages})</span>}</Label>
          <button
            type="button"
            onClick={() => document.getElementById("pub-images-upload")?.click()}
            className="flex items-center gap-1.5 text-xs font-bold text-[var(--aduti-primary)] hover:text-blue-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Ajouter
          </button>
        </div>

        {totalImages > 0 && (
          <div className="max-h-[220px] overflow-y-auto rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="grid grid-cols-3 gap-2">
              {/* Existing images */}
              {formData.existingImages.map((url, idx) => (
                <div key={`existing-${idx}`} className="relative aspect-square rounded-lg overflow-hidden group border border-slate-200 bg-white">
                  <Image src={url} alt="" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(idx)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* New images with real previews */}
              {formData.images.map((_, idx) => (
                <div key={`new-${idx}`} className="relative aspect-square rounded-lg overflow-hidden group border-2 border-blue-200 bg-blue-50/50">
                  {imagePreviews[idx] && (
                    <Image src={imagePreviews[idx]} alt="" fill className="object-cover" unoptimized />
                  )}
                  <div className="absolute top-1 left-1 bg-[var(--aduti-primary)] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide shadow z-10">
                    Nouveau
                  </div>
                  <button
                    type="button"
                    onClick={() => removeNewImage(idx)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalImages === 0 && (
          <button
            type="button"
            onClick={() => document.getElementById("pub-images-upload")?.click()}
            className="w-full border-2 border-dashed border-slate-200 rounded-xl h-20 flex flex-col items-center justify-center gap-1.5 hover:border-[var(--aduti-primary)]/40 hover:bg-blue-50/30 transition-all group"
          >
            <Upload className="w-5 h-5 text-slate-300 group-hover:text-[var(--aduti-primary)]/50 transition-colors" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-[var(--aduti-primary)]/70 transition-colors">Ajouter des photos</span>
          </button>
        )}

        <input id="pub-images-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-[var(--aduti-primary)] hover:bg-blue-600 text-white h-12 rounded-xl font-bold"
      >
        {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement...</> : isEditing ? "Mettre à jour" : "Publier"}
      </Button>
    </form>
  );
}
