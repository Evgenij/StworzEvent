// src/components/dashboard/events/event-cover-upload.tsx
"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { useUploadThing } from "@/lib/uploadthing"; // сгенерируется после настройки UploadThing
import { IconPhoto, IconX, IconLoader2 } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
	value?: string;
	onChange: (url: string) => void;
	onClear: () => void;
}

export function EventCoverUpload({ value, onChange, onClear }: Props) {
	const [isUploading, setIsUploading] = useState(false);

	const { startUpload, routeConfig } = useUploadThing("eventCover", {
		onClientUploadComplete: (res) => {
			onChange(res[0].url);
			setIsUploading(false);
		},
		onUploadError: () => {
			setIsUploading(false);
		},
	});

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			setIsUploading(true);
			startUpload(acceptedFiles);
		},
		[startUpload],
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: generateClientDropzoneAccept(["image/*"]),
		maxFiles: 1,
		disabled: isUploading,
	});

	if (value) {
		return (
			<div className="relative aspect-video w-full overflow-hidden rounded-lg border">
				<Image
					src={value}
					alt="Обложка"
					fill
					className="object-cover"
				/>
				<button
					type="button"
					onClick={onClear}
					className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
				>
					<IconX className="size-4" />
				</button>
			</div>
		);
	}

	return (
		<div
			{...getRootProps()}
			className={cn(
				"flex aspect-video w-full cursor-pointer flex-col items-center justify-center",
				"rounded-lg border-2 border-dashed transition-colors",
				isDragActive
					? "border-primary bg-primary/5"
					: "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
			)}
		>
			<input {...getInputProps()} />
			{isUploading ? (
				<IconLoader2 className="size-8 animate-spin text-muted-foreground" />
			) : (
				<>
					<IconPhoto className="mb-2 size-8 text-muted-foreground" />
					<p className="text-sm text-muted-foreground">
						{isDragActive
							? "Upuść tutaj..."
							: "Przeciągnij lub kliknij"}
					</p>
					<p className="mt-1 text-xs text-muted-foreground/60">
						PNG, JPG do 4MB
					</p>
				</>
			)}
		</div>
	);
}
