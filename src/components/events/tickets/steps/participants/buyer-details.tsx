import { Typography } from "@/components/shared";
import { IconUserHexagon } from "@tabler/icons-react";
import { SelectedTicket } from "../../tickets-drawer";
import { Label } from "@/components/shadcn/ui/label";
import { Checkbox } from "@/components/shadcn/ui/checkbox";
import { TicketTypePicker } from "./ticket-type-picker";
import { BuyerForm } from "./forms/buyer-form";
import { Field } from "@/components/shadcn/ui/field";
import { OrderFormValues } from "@/schemas/order.schema";
import { UseFormReturn } from "react-hook-form";

type BuyerDetailsProps = {
	form: UseFormReturn<OrderFormValues>;
	buyerIsParticipant: boolean;
	buyerTicketGroupIdx: number;
	items: SelectedTicket[];
	onBuyerIsParticipantChange: (v: boolean) => void;
	onBuyerTicketGroupIdxChange: (v: number) => void;
};

const BuyerDetails = ({
	form,
	buyerIsParticipant,
	buyerTicketGroupIdx,
	items,
	onBuyerIsParticipantChange,
	onBuyerTicketGroupIdxChange,
}: BuyerDetailsProps) => {
	return (
		<div className="buyer-details flex flex-col gap-4 border rounded-2xl p-5">
			<Typography
				variant="h3"
				className="font-semibold flex gap-2 items-center"
			>
				<IconUserHexagon className="size-6 text-primary" />
				Zamawiający
			</Typography>
			<BuyerForm form={form} />
			<Field orientation="horizontal">
				<Checkbox
					id="buyerIsParticipant"
					name="buyerIsParticipant"
					checked={buyerIsParticipant}
					onCheckedChange={(v) => onBuyerIsParticipantChange(!!v)}
				/>
				<Label htmlFor="buyerIsParticipant">
					Jestem uczestnikiem (bilet 1)
				</Label>
			</Field>
			{buyerIsParticipant && (
				<TicketTypePicker
					items={items}
					value={buyerTicketGroupIdx}
					onChange={onBuyerTicketGroupIdxChange}
				/>
			)}
		</div>
	);
};

export default BuyerDetails;
