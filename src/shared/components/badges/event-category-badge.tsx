import { Badge, badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EventStatus } from "@prisma/client";
import {
	IconArchive,
	IconBroadcast,
	IconCircleCheck,
	IconCircleX,
	IconFile,
	IconLock,
	IconPlayerPause,
	IconEye,
	IconTag,
	IconBan,
	IconEyeOff,
	IconCheck,
	IconFlame,
	IconCancel,
} from "@tabler/icons-react";
import { VariantProps } from "class-variance-authority";
import { useTranslations } from "next-intl";
import { ComponentType } from "react";

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

export type StatusConfig = {
	variant: BadgeVariant;
	icon: ComponentType<{ className?: string }>;
};

const dataStatuses: Record<EventStatus, StatusConfig> = {
	[EventStatus.DRAFT]: { variant: "outline", icon: IconFile },
	[EventStatus.PUBLISHED]: { variant: "outline", icon: IconCheck },
	[EventStatus.SALES_OPEN]: { variant: "success", icon: IconFlame },
	[EventStatus.SALES_PAUSED]: { variant: "outline", icon: IconPlayerPause },
	[EventStatus.SALES_CLOSED]: { variant: "outline", icon: IconLock },
	[EventStatus.LIVE]: { variant: "default", icon: IconBroadcast },
	[EventStatus.COMPLETED]: { variant: "success", icon: IconCheck },
	[EventStatus.CANCELLED]: { variant: "destructive", icon: IconCancel },
	[EventStatus.ARCHIVED]: { variant: "outline", icon: IconArchive },
	[EventStatus.UNPUBLISHED]: { variant: "outline", icon: IconEyeOff },
};

const EventCategoryBadge = ({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => {
	return (
		<Badge
			className={cn("event-category-badge", className)}
			variant="ghost"
		>
			{children}
		</Badge>
	);
};

export default EventCategoryBadge;
