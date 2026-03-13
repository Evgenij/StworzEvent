import { useCountdown } from "@/hooks/use-countdown";
import { cn } from "@/lib/utils";
import { IconClock, IconClockExclamation } from "@tabler/icons-react";
import React from "react";

type ReservationTimerProps = {
	expiresAt: Date;
	isExpired: boolean;
	remaining: number;
	formatted: string;
};

const ReservationTimer = ({
	isExpired,
	remaining,
	formatted,
}: ReservationTimerProps) => {
	const isAlmostExpired = remaining < 3 * 60 * 1000 && !isExpired; // если осталось меньше 3 минут и не истекло

	return (
		<div
			className={cn(
				"bg-muted rounded-lg p-3 text-sm flex items-center gap-2",
				isAlmostExpired
					? "bg-destructive/10 text-destructive"
					: "text-muted-foreground",
			)}
		>
			{isAlmostExpired ? (
				<IconClockExclamation className="size-5 text-destructive" />
			) : (
				<IconClock className="size-5" />
			)}

			<span>
				Rezerwacja wygasa za{" "}
				<span
					className={cn(
						"font-bold",
						isAlmostExpired
							? "text-destructive"
							: "text-foreground",
					)}
				>
					{formatted}
				</span>
			</span>
		</div>
	);
};

export default ReservationTimer;
