"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { useUploadThing } from "@/lib/uploadthing";
import { IconCamera, IconLoader, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import { deleteUploadAction } from "@/lib/delete-upload.action";
import { updateOrganizationLogoAction } from "@/features/organizations/actions/update-organization-logo.action";

type Props = {
	organizationId: string;
	organizationName: string;
	initialLogo: string | null;
};

export function OrganizationLogoUpload({
	organizationId,
	organizationName,
	initialLogo,
}: Props) {
	const [logo, setLogo] = useState<string | null>(initialLogo);
	const [isUploading, setIsUploading] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const { startUpload, routeConfig } = useUploadThing("organizationLogo", {
		onClientUploadComplete: async (res) => {
			const url = res[0].ufsUrl;
			const result = await updateOrganizationLogoAction({
				organizationId,
				logoUrl: url,
			});
			if (!result.success) {
				toast.error("Nie udało się zapisać logo");
				await deleteUploadAction(url);
			} else {
				setLogo(url);
				toast.success("Logo zaktualizowane");
			}
			setIsUploading(false);
		},
		onUploadError: () => {
			toast.error("Błąd podczas przesyłania pliku");
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
		disabled: isUploading || isDeleting,
	});

	const handleDelete = async (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!logo) return;
		setIsDeleting(true);
		await deleteUploadAction(logo);
		const result = await updateOrganizationLogoAction({
			organizationId,
			logoUrl: null,
		});
		if (!result.success) {
			toast.error("Nie udało się usunąć logo");
		} else {
			setLogo(null);
			toast.success("Logo usunięte");
		}
		setIsDeleting(false);
	};

	const initials = organizationName
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();

	const busy = isUploading || isDeleting;

	return (
		<div className="relative size-24 shrink-0">
			<div
				{...getRootProps()}
				className={cn(
					"relative size-24 rounded-full border-2 border-dashed cursor-pointer overflow-hidden",
					"flex items-center justify-center transition-colors select-none",
					isDragActive
						? "border-primary bg-primary/10"
						: logo
							? "border-transparent"
							: "border-white/10 bg-white/10 hover:border-white/30",
					busy && "pointer-events-none opacity-70",
				)}
			>
				<input {...getInputProps()} />

				{logo ? (
					<Image
						src={logo}
						alt={organizationName}
						fill
						className="object-cover rounded-full"
					/>
				) : busy ? null : (
					<div className="flex flex-col items-center gap-1">
						<IconCamera className="size-6 text-white/30" />
						<span className="text-[10px] text-white/30 leading-tight text-center px-1">
							Logo
						</span>
					</div>
				)}

				{busy && (
					<div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/30">
						<IconLoader className="size-6 text-white animate-spin" />
					</div>
				)}

				{logo && !busy && (
					<div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/0 hover:bg-black/60 transition-colors group">
						<IconCamera className="size-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
					</div>
				)}
			</div>

			{logo && !busy && (
				<button
					type="button"
					onClick={handleDelete}
					className="absolute top-0 right-0 size-6 rounded-full bg-white/20 bg-blur-sm backdrop-blur-sm text-destructive-foreground flex items-center justify-center shadow hover:bg-destructive/80 transition-colors cursor-pointer"
					aria-label="Usuń logo"
				>
					<IconX className="size-3.5 text-white" />
				</button>
			)}
		</div>
	);
}
