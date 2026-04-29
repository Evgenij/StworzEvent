"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconLink, IconPlus, IconShare, IconShare2 } from "@tabler/icons-react";
import { toast } from "sonner";

type ShareButtonProps = {
	title: string;
	url?: string;
};

export const ShareButton = ({ title, url }: ShareButtonProps) => {
	const handleShare = async (copy: boolean = false) => {
		const shareUrl = url ?? window.location.href;

		if (copy) {
			await navigator.clipboard.writeText(shareUrl);
			toast.success("Ссылка скопирована");
		} else {
			if (navigator.share) {
				// нативный шейр на мобиле
				await navigator.share({
					title,
					url: shareUrl,
				});
			} else {
				// фолбэк — копируем ссылку
				await navigator.clipboard.writeText(shareUrl);
				toast.success("Ссылка скопирована");
			}
		}
	};

	return (
		<ButtonGroup>
			<Button
				variant="outline"
				size="sm"
				onClick={() => handleShare()}
				className="group"
			>
				<IconShare2 className="size-4 group-hover:text-blue-600" />{" "}
				Udostępnij
			</Button>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="outline"
						size="icon-sm"
						className="group"
						onClick={() => handleShare(true)}
					>
						<IconLink className=" group-hover:text-primary" />
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Skopiuj link</p>
				</TooltipContent>
			</Tooltip>
		</ButtonGroup>
	);
};
