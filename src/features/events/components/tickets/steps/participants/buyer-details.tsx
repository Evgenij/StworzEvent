import { Typography } from "@/shared/components";
import { IconUserHexagon } from "@tabler/icons-react";
import { SelectedTicket } from "../../tickets-drawer";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { TicketTypePicker } from "./ticket-type-picker";
import { BuyerForm } from "./forms/buyer-form";
import { Field } from "@/components/ui/field";
import { UseFormReturn } from "react-hook-form";
import { OrderFormValues } from "@/features/orders/schemas/order.schema";

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
