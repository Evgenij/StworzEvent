type EventMetaItemProps = {
	label: { title: string; value: string | null };

	header: string | null;
	subheader: string | null;
};

const EventMetaItem = ({ label, header, subheader }: EventMetaItemProps) => {
	return (
		<div className="event-meta-item flex items-center gap-3">
			<div className="event-meta-item_calendar min-w-13 flex flex-col items-center border-2 border-gray-200 rounded-md overflow-hidden">
				<div className="px-1.5 py-1 bg-gray-200 w-full">
					<p className="text-xs text-muted-foreground text-center">
						{label.title}
					</p>
				</div>
				<div className="bg-white w-full px-2 py-1.5">
					<p className="text-sm font-semibold leading-none text-center w-full ">
						{label.value}
					</p>
				</div>
			</div>

			<div>
				<p className="font-medium capitalize text-sm">{header}</p>
				<p className="text-sm text-muted-foreground">{subheader}</p>
			</div>
		</div>
	);
};

export default EventMetaItem;
