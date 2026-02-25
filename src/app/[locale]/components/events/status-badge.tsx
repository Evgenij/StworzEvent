import { Badge } from "@/shadcn/ui/badge";
import { Event, EventStatus } from "@prisma/client";
import { useTranslations } from "next-intl";
import React from "react";

const statusVariants: Record<
	EventStatus,
	"default" | "destructive" | "outline" | "secondary"
> = {
	DRAFT: "outline",
	REVIEW: "secondary",
	PUBLISHED: "default",
	SALES_OPEN: "default",
	SALES_PAUSED: "secondary",
	SALES_CLOSED: "outline",
	LIVE: "default",
	COMPLETED: "secondary",
	CANCELLED: "destructive",
	ARCHIVED: "outline",
	BLOCKED: "destructive",
	UNPUBLISHED: "secondary",
};

const StatusBadge = ({ status }: { status: Event["status"] }) => {
	const t = useTranslations("EventStatus");

	return <Badge variant={statusVariants[status]}>{t(status)}</Badge>;
};

export default StatusBadge;
