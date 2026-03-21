// src/components/dashboard/events/sections/section-gallery.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/shadcn/ui/button";
import { Label } from "@/components/shadcn/ui/label";
import { Field } from "@/components/shadcn/ui/field";
import {
	InputGroup,
	InputGroupInput,
} from "@/components/shadcn/ui/input-group";
import { IconLoader2, IconX, IconPhoto } from "@tabler/icons-react";
import { useUploadThing } from "@/lib/uploadthing";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { updateSectionAction } from "@/actions/events/sections/update-section.action";
import { SectionType } from "@prisma/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useCallback } from "react";
import type { SectionData } from "./section-card";

type Props = {
	section: SectionData;
};

type ImageItem = {
	url: string;
	alt: string;
};

export function SectionGallery({ section }: Props) {
	const t = useTranslations("EventWizard.sections");
	const [title, setTitle] = useState(section.title ?? "");
	const [images, setImages] = useState<ImageItem[]>(
		(section.content as any)?.images ?? [],
	);
	const [isUploading, setIsUploading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const { startUpload } = useUploadThing("eventCover", {
		onClientUploadComplete: (res) => {
			const newImages: ImageItem[] = res.map((r, i) => ({
				url: r.url,
				alt: `Zdjęcie ${images.length + i + 1}`,
			}));
			setImages((prev) => [...prev, ...newImages]);
			setIsUploading(false);
		},
		onUploadError: () => setIsUploading(false),
	});

	const onDrop = useCallback(
		(files: File[]) => {
			setIsUploading(true);
			startUpload(files);
		},
		[startUpload],
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: generateClientDropzoneAccept(["image/*"]),
		disabled: isUploading,
	});

	const removeImage = (url: string) => {
		setImages((prev) => prev.filter((img) => img.url !== url));
	};

	const updateAlt = (url: string, alt: string) => {
		setImages((prev) =>
			prev.map((img) => (img.url === url ? { ...img, alt } : img)),
		);
	};

	const handleSave = async () => {
		setIsSaving(true);
		const result = await updateSectionAction({
			sectionId: section.id,
			data: {
				type: SectionType.IMAGE,
				title,
				content: { images },
			},
		});
		setIsSaving(false);

		if (!result.success) {
			toast.error(t("errors.saveFailed"));
			return;
		}
		toast.success(t("saved"));
	};

	return (
		<div className="flex flex-col gap-3">
			<Field>
				<Label>{t("sectionTitle")}</Label>
				<InputGroup>
					<InputGroupInput
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder={t("sectionTitlePlaceholder")}
					/>
				</InputGroup>
			</Field>

			{/* Превью с полем alt */}
			{images.length > 0 && (
				<div className="grid grid-cols-3 gap-2">
					{images.map((img) => (
						<div key={img.url} className="flex flex-col gap-1">
							<div className="relative aspect-video overflow-hidden rounded-md border">
								<Image
									src={img.url}
									alt={img.alt}
									fill
									className="object-cover"
								/>
								<button
									type="button"
									onClick={() => removeImage(img.url)}
									className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
								>
									<IconX className="size-3" />
								</button>
							</div>
							{/* Alt текст */}
							<input
								type="text"
								value={img.alt}
								onChange={(e) =>
									updateAlt(img.url, e.target.value)
								}
								placeholder={t("altPlaceholder")}
								className="w-full rounded border px-2 py-1 text-xs"
							/>
						</div>
					))}
				</div>
			)}

			{/* Dropzone */}
			<div
				{...getRootProps()}
				className={cn(
					"flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed py-6 transition-colors",
					isDragActive
						? "border-primary bg-primary/5"
						: "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
				)}
			>
				<input {...getInputProps()} />
				{isUploading ? (
					<IconLoader2 className="size-6 animate-spin text-muted-foreground" />
				) : (
					<>
						<IconPhoto className="mb-1 size-6 text-muted-foreground" />
						<p className="text-xs text-muted-foreground">
							{isDragActive ? t("dropHere") : t("uploadHint")}
						</p>
					</>
				)}
			</div>

			<Button
				type="button"
				size="sm"
				disabled={isSaving || images.length === 0}
				onClick={handleSave}
				className="self-end"
			>
				{isSaving ? (
					<>
						<IconLoader2 className="mr-2 size-4 animate-spin" />
						{t("saving")}
					</>
				) : (
					t("save")
				)}
			</Button>
		</div>
	);
}
