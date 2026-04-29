// src/components/dashboard/events/event-cover-upload.tsx
"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { useUploadThing } from "@/lib/uploadthing";
import { IconPhoto, IconX, IconLoader } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Props {
	value?: string;
	onChange: (url: string) => void;
	onClear: () => void;
}

export function EventCoverUpload({ value, onChange, onClear }: Props) {
	const [isUploading, setIsUploading] = useState(false);

	const { startUpload, routeConfig } = useUploadThing("eventCover", {
		onClientUploadComplete: (res) => {
			onChange(res[0].ufsUrl);
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
			<div className="relative aspect-video w-full overflow-hidden rounded-2xl border">
				<Image
					src={value}
					alt="eventCoverImage"
					fill
					className="object-cover"
				/>
				<Button
					onClick={onClear}
					variant={"outline"}
					className="absolute right-3 top-3 rounded-lg bg-black/40 border-white/10 text-white hover:bg-black hover:text-white"
				>
					<IconX className="size-4" />
				</Button>
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
					? "border-primary bg-primary/10"
					: "border-muted-foreground/25 bg-muted-foreground/5 hover:border-muted-foreground/60 hover:bg-muted-foreground/10",
			)}
		>
			<input {...getInputProps()} />
			{isUploading ? (
				<IconLoader className="size-8 animate-spin text-muted-foreground" />
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
