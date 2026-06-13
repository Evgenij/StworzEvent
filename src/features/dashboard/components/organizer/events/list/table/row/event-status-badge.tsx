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

type StatusConfig = {
	variant: BadgeVariant;
	icon: ComponentType<{ className?: string }>;
};

const statuses: Record<EventStatus, StatusConfig> = {
	[EventStatus.DRAFT]: { variant: "secondary", icon: IconFile },
	[EventStatus.REVIEW]: { variant: "outline", icon: IconEye },
	[EventStatus.PUBLISHED]: { variant: "outline", icon: IconCheck },
	[EventStatus.SALES_OPEN]: { variant: "success", icon: IconFlame },
	[EventStatus.SALES_PAUSED]: { variant: "secondary", icon: IconPlayerPause },
	[EventStatus.SALES_CLOSED]: { variant: "outline", icon: IconLock },
	[EventStatus.LIVE]: { variant: "default", icon: IconBroadcast },
	[EventStatus.COMPLETED]: { variant: "success", icon: IconCheck },
	[EventStatus.CANCELLED]: { variant: "destructive", icon: IconCancel },
	[EventStatus.ARCHIVED]: { variant: "ghost", icon: IconArchive },
	[EventStatus.BLOCKED]: { variant: "destructive", icon: IconBan },
	[EventStatus.UNPUBLISHED]: { variant: "secondary", icon: IconEyeOff },
};

const EventStatusBadge = ({
	className,
	status,
}: {
	className?: string;
	status: EventStatus;
}) => {
	const t = useTranslations("EventStatus");
	const { variant, icon: Icon } = statuses[status];

	return (
		<Badge
			className={cn("event-status-badge", className)}
			variant={variant}
		>
			<Icon />
			{t(status)}
		</Badge>
	);
};

export default EventStatusBadge;
