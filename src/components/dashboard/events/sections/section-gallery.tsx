"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/shadcn/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/shadcn/ui/field";
import {
	InputGroup,
	InputGroupInput,
} from "@/components/shadcn/ui/input-group";
import {
	IconDeviceFloppy,
	IconLoader,
	IconX,
	IconPhoto,
} from "@tabler/icons-react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
	type SectionImageInput,
	sectionImageSchema,
} from "@/schemas/section.schema";

type Props = {
	section: SectionData;
	onTitleChange?: (title: string) => void;
};

export function SectionGallery({ section, onTitleChange }: Props) {
	const t = useTranslations("EventWizard.sections");
	const tErrors = useTranslations("EventWizard.sections.errors");

	const form = useForm<SectionImageInput>({
		resolver: zodResolver(sectionImageSchema(tErrors)),
		defaultValues: {
			type: SectionType.IMAGE,
			title: section.title ?? "",
			content: {
				images: (section.content as any)?.images ?? [],
			},
		},
		mode: "onBlur",
		reValidateMode: "onChange",
	});

	const {
		handleSubmit,
		control,
		formState: { isSubmitting, errors },
	} = form;

	const { fields, append, remove } = useFieldArray({
		control,
		name: "content.images",
	});

	const { startUpload, isUploading } = useUploadThing("eventGalleryImage", {
		onClientUploadComplete: (res) => {
			res.forEach((r, i) => {
				append({
					url: r.ufsUrl,
					alt: `Zdjęcie ${fields.length + i + 1}`,
				});
			});
		},
		onUploadError: () => {
			toast.error(t("errors.uploadFailed"));
		},
	});

	const onDrop = useCallback(
		(files: File[]) => {
			startUpload(files);
		},
		[startUpload],
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: generateClientDropzoneAccept(["image/*"]),
		disabled: isUploading,
	});

	const onSubmit = async (values: SectionImageInput) => {
		const result = await updateSectionAction({
			sectionId: section.id,
			data: {
				type: SectionType.IMAGE,
				title: values.title,
				content: values.content,
			},
		});

		if (!result.success) {
			toast.error(t("errors.saveFailed"));
			return;
		}

		onTitleChange?.(values.title);
		toast.success(t("saved"));
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
			<Controller
				name="title"
				control={control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel>{t("sectionTitle")}</FieldLabel>
						<InputGroup>
							<InputGroupInput
								{...field}
								aria-invalid={fieldState.invalid}
								placeholder={t("sectionTitlePlaceholder")}
							/>
						</InputGroup>
						{fieldState.invalid && (
							<FieldError errors={[fieldState.error]} />
						)}
					</Field>
				)}
			/>

			{/* Превью с полем alt */}
			{fields.length > 0 && (
				<div className="grid grid-cols-3 gap-2">
					{fields.map((field, index) => (
						<div key={field.id} className="flex flex-col gap-1">
							<div className="relative aspect-video overflow-hidden rounded-lg border">
								<Image
									src={field.url}
									alt={field.alt ?? ""}
									fill
									className="object-cover"
								/>
								<button
									type="button"
									onClick={() => remove(index)}
									className="absolute cursor-pointer right-1 top-1 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
								>
									<IconX className="size-3" />
								</button>
							</div>
							<Controller
								name={`content.images.${index}.alt`}
								control={control}
								render={({ field: altField }) => (
									<input
										{...altField}
										type="text"
										placeholder={t("altPlaceholder")}
										className="w-full rounded-md border px-2 py-1 text-xs"
									/>
								)}
							/>
						</div>
					))}
				</div>
			)}

			{/* Ошибка минимум 1 фото */}
			{errors.content?.images?.root?.message && (
				<p className="text-sm text-destructive">
					{errors.content.images.root.message}
				</p>
			)}

			{/* Dropzone */}
			<div
				{...getRootProps()}
				className={cn(
					"flex cursor-pointer flex-col gap-1 items-center justify-center rounded-xl border-2 border-dashed py-8 transition-colors group",
					isDragActive && !isUploading
						? "border-primary bg-primary/5"
						: "border-muted-foreground/25 hover:border-primary/80 hover:bg-primary/5",
				)}
			>
				<input {...getInputProps()} />
				{isUploading ? (
					<>
						<IconLoader className="size-5 animate-spin text-muted-foreground" />
						<p className="text-sm text-muted-foreground">
							Ladowanie...
						</p>
					</>
				) : (
					<>
						<IconPhoto className="mb-1 size-6 text-muted-foreground group-hover:text-primary" />
						<p className="text-sm text-muted-foreground group-hover:text-primary">
							{isDragActive ? t("dropHere") : t("uploadHint")}
						</p>
					</>
				)}
			</div>

			<Button
				type="submit"
				variant="success"
				size="sm"
				disabled={isSubmitting || isUploading || fields.length === 0}
				className="self-end"
			>
				{isSubmitting ? (
					<>
						<IconLoader className="mr-2 size-4 animate-spin" />
						{t("saving")}
					</>
				) : (
					<>
						<IconDeviceFloppy className="size-4" />
						{t("save")}
					</>
				)}
			</Button>
		</form>
	);
}
