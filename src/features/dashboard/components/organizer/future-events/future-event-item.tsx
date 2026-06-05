import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import React from "react";

export type FutureEventItemType = {
	id: number;
	cover?: string | null;
	title: string;
	date: string;
	location: string;
	registration: { expected: number; actual: number };
};

const FutureEventItem = ({ event }: { event: FutureEventItemType }) => {
	const { expected, actual } = event.registration;
	const percent = (actual / expected) * 100;

	return (
		<div className="future-event-item flex justify-between gap-5 items-center py-3 first:pt-0 last:pb-0">
			<div className="future-event-item__data flex items-center gap-3 w-3/5">
				<img
					className="future-event-item__preview aspect-square h-16 rounded-lg object-cover object-center"
					src={event.cover ?? "/placeholder.jpg"}
				></img>
				<div className="future-event-item__info">
					<h6 className="future-event-item__info__title font-medium line-clamp-1">
						{event.title}
					</h6>
					<p className="future-event-item__info__date text-muted-foreground text-sm">
						{event.date}
					</p>
				</div>
			</div>
			<div className="future-event-item__stats flex items-center gap-3 w-2/5 text-sm">
				<div className="future-event-item__stats__counter text-muted-foreground gap-0.5 flex items-baseaseline">
					<span className="font-medium text-black">{actual}</span>
					<span>/</span>
					<span>{expected}</span>
				</div>
				<Progress value={percent} />
				<div className="future-event-item__stats__percent font-semibold text-primary">
					{percent.toFixed(0) + "%"}
				</div>
			</div>
		</div>
	);
};

export default FutureEventItem;
