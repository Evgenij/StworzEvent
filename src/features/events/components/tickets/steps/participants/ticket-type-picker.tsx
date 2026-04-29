import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectedTicket } from "../../tickets-drawer";

type TicketTypePickerProps = {
	items: SelectedTicket[];
	value: number; // buyerTicketGroupIdx
	onChange: (idx: number) => void;
};

export const TicketTypePicker = ({
	items,
	value,
	onChange,
}: TicketTypePickerProps) => {
	return (
		<div className="flex flex-col gap-2">
			<Label>Rodzaj biletu</Label>
			<RadioGroup
				value={String(value)}
				onValueChange={(v) => onChange(Number(v))}
				className="flex flex-col gap-2"
			>
				{items.map((item, gi) => (
					<label
						key={item.ticket.id}
						htmlFor={`ticket-type-${gi}`}
						className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
							value === gi
								? "border-primary bg-primary/5"
								: "border-border hover:border-primary/50"
						}`}
					>
						<span className="font-medium text-sm">
							{item.ticket.name}
						</span>
						<RadioGroupItem
							id={`ticket-type-${gi}`}
							value={String(gi)}
						/>
					</label>
				))}
			</RadioGroup>
		</div>
	);
};
