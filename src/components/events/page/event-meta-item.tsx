import React from "react";

type EventMetaItemProps = {
	month: string;
	day: string | null;
	header: string | null;
	subheader: string | null;
};

const EventMetaItem = ({
	month,
	day,
	header,
	subheader,
}: EventMetaItemProps) => {
	return (
		<div className="flex items-center gap-4">
			<div className="flex flex-col items-center border-3 border-gray-200 rounded-md overflow-hidden">
				<div className="px-2 py-1 bg-gray-200 w-full">
					<p className="text-xs text-muted-foreground text-center">
						{month}
					</p>
				</div>
				<div className="bg-white w-full px-2 py-2">
					<p className="text-lg font-bold leading-none text-center w-full">
						{day}
					</p>
				</div>
			</div>

			<div>
				<p className="font-medium capitalize">{header}</p>
				<p className="text-sm text-muted-foreground">
					{subheader}
					{/* {startTime}
					{endTime ? ` - ${endTime}` : ""} */}
				</p>
			</div>
		</div>
	);
};

export default EventMetaItem;
