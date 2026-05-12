"use client";

import { Button } from "@/components/ui/button";
import { deleteUploadAction } from "@/lib/delete-upload.action";
import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import {
	IconCloudUpload,
	IconEye,
	IconLoader,
	IconTrash,
} from "@tabler/icons-react";
import { useDropzone } from "@uploadthing/react";
import { useCallback, useState } from "react";
import { generateClientDropzoneAccept } from "uploadthing/client";

interface Props {
	value?: string;
	onChange: (url: string) => void;
	onClear: () => void;
	className?: string;
}

const formatSize = (bytes: number) => {
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ConfirmationUpload = ({ value, onChange, onClear, className }: Props) => {
	const [isUploading, setIsUploading] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [progress, setProgress] = useState(0);
	const [fileInfo, setFileInfo] = useState<{
		name: string;
		size: number;
	} | null>(null);

	const { startUpload } = useUploadThing("paymentConfirmationImage", {
		onUploadProgress: (p) => setProgress(p),
		onClientUploadComplete: (res) => {
			onChange(res[0].ufsUrl);
			setIsUploading(false);
			setProgress(100);
		},
		onUploadError: () => {
			setIsUploading(false);
			setFileInfo(null);
			setProgress(0);
		},
	});

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			const file = acceptedFiles[0];
			if (!file) return;
			setFileInfo({ name: file.name, size: file.size });
			setIsUploading(true);
			setProgress(0);
			startUpload(acceptedFiles);
		},
		[startUpload],
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: generateClientDropzoneAccept(["image/*", "application/pdf"]),
		maxFiles: 1,
		disabled: isUploading || !!value,
	});

	const handleClear = async () => {
		if (value) {
			setIsDeleting(true);
			await deleteUploadAction(value);
			setIsDeleting(false);
		}
		setFileInfo(null);
		setProgress(0);
		onClear();
	};

	return (
		<div className={cn("flex flex-col gap-3", className)}>
			{!value && (
				<div
					{...getRootProps()}
					className={cn(
						"flex flex-col items-center justify-center gap-2 p-6 cursor-pointer rounded-xl border-2 border-dashed transition-colors",
						isDragActive
							? "border-primary bg-primary/10"
							: "border-primary/40 bg-primary/5 hover:border-primary/60 hover:bg-primary/10",
						isUploading && "pointer-events-none",
					)}
				>
					<input {...getInputProps()} />
					<div className="p-3 bg-primary/10 rounded-full">
						<IconCloudUpload className="size-6 text-primary" />
					</div>
					<div className="text-center">
						<p className="text-sm font-medium">
							{isDragActive ? (
								"Upuść tutaj..."
							) : (
								<>
									Przeciągnij screenshot lub{" "}
									<span className="text-primary underline">
										wybierz plik
									</span>
								</>
							)}
						</p>
						<p className="text-xs text-muted-foreground mt-1">
							Zrzut ekranu z aplikacji bankowej, potwierdzenie SMS
							lub PDF z banku.
						</p>
						<p className="text-xs text-muted-foreground mt-3">
							PNG · JPG · HEIC · PDF · do 8 MB
						</p>
					</div>
				</div>
			)}

			{fileInfo && (
				<div className="flex items-center gap-3 p-3 border border-border rounded-xl">
					<div className="shrink-0 size-10 bg-muted rounded-md overflow-hidden">
						{value ? (
							<img
								src={value}
								alt=""
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="w-full h-full bg-primary/20 animate-pulse" />
						)}
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-medium truncate">
							{fileInfo.name}
						</p>
						<p className="text-xs text-muted-foreground">
							{formatSize(fileInfo.size)} ·{" "}
							{isUploading
								? "wysyłanie..."
								: "gotowe do wysłania"}
						</p>
						<div className="mt-1.5 h-1 bg-muted rounded-full overflow-hidden">
							<div
								className="h-full bg-green-500 rounded-full transition-all duration-300"
								style={{ width: `${progress}%` }}
							/>
						</div>
					</div>
					<div className="flex items-center gap-1 shrink-0">
						{value && (
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="size-8 text-muted-foreground"
								onClick={() => window.open(value, "_blank")}
							>
								<IconEye className="size-4" />
							</Button>
						)}
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="size-8 text-muted-foreground hover:text-destructive"
							onClick={handleClear}
							disabled={isDeleting || isUploading}
						>
							{isDeleting ? (
								<IconLoader className="size-4 animate-spin" />
							) : (
								<IconTrash className="size-4" />
							)}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export default ConfirmationUpload;
