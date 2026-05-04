import { cn } from "@/lib/utils";
import {
	IconArrowBackUp,
	IconQrcode,
	IconShoppingCart,
} from "@tabler/icons-react";
import React from "react";

export type LiveActionItemType =
	| {
			id: string;
			type: "ORDER_PAID";
			participant: string;
			ticketCount: number;
			ticketType: string;
			event: string;
			amount: number;
			timestamp: string;
	  }
	| {
			id: string;
			type: "CHECKED_IN";
			participant: string;
			gender: "m" | "f";
			ticketNumber: string;
			timestamp: string;
	  }
	| {
			id: string;
			type: "REFUND";
			recipient: string;
			event: string;
			amount: number;
			timestamp: string;
	  };

const iconConfig = {
	ORDER_PAID: {
		icon: IconShoppingCart,
		className: "bg-orange-100 text-orange-500",
	},
	CHECKED_IN: {
		icon: IconQrcode,
		className: "bg-green-100 text-green-600",
	},
	REFUND: {
		icon: IconArrowBackUp,
		className: "bg-red-100 text-red-500",
	},
};

const LiveActionItem = ({ action }: { action: LiveActionItemType }) => {
	const { icon: Icon, className: iconClassName } = iconConfig[action.type];

	const isRecent = action.timestamp.includes("min");

	const renderMainContent = () => {
		switch (action.type) {
			case "ORDER_PAID":
				return (
					<>
						<span className="font-medium text-sm">
							{action.participant}
						</span>
						<span className="text-muted-foreground text-sm">
							{" "}
							· {action.ticketCount}× {action.ticketType}
						</span>
					</>
				);
			case "CHECKED_IN":
				return (
					<>
						<span className="font-medium text-sm">
							{action.participant}
						</span>
						<span className="text-muted-foreground text-sm ml-2">
							{action.gender === "f"
								? "zameldowana"
								: "zameldowany"}
						</span>
					</>
				);
			case "REFUND":
				return (
					<>
						<span className="font-medium text-sm">Zwrot ·</span>
						<span className="text-muted-foreground text-sm ml-2">
							{action.recipient}
						</span>
					</>
				);
		}
	};

	const renderSubtext = () => {
		switch (action.type) {
			case "ORDER_PAID":
				return `${action.event} · ${action.amount.toLocaleString("pl-PL")} zł`;
			case "CHECKED_IN":
				return `Bilet #${action.ticketNumber}`;
			case "REFUND":
				return `${action.event} · -${action.amount} zł`;
		}
	};

	return (
		<div className="live-action-item flex gap-3 py-3 first:pt-0 last:pb-0 z-10">
			<div className="shrink-0">
				<div
					className={cn(
						"w-9 h-9 rounded-full flex items-center justify-center",
						iconClassName,
					)}
				>
					<Icon className="size-[18px]" />
				</div>
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex justify-between items-start gap-2">
					<div className="leading-tight">{renderMainContent()}</div>
					<span
						className={cn(
							"text-xs shrink-0 mt-0.5",
							isRecent
								? "text-primary font-medium"
								: "text-muted-foreground",
						)}
					>
						{action.timestamp}
					</span>
				</div>
				<p className="text-xs text-muted-foreground mt-0.5">
					{renderSubtext()}
				</p>
			</div>
		</div>
	);
};

export default LiveActionItem;
