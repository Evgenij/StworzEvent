import { UseFormReturn } from "react-hook-form";
import { OrderFormValues } from "@/schemas/order.schema";
import { TicketWrapper } from "./ticket-wrapper";
import { ParticipantFormCard } from "./forms/participant-form";
import { truncate } from "@/lib/utils";
import { IconTicket, IconUserCheck } from "@tabler/icons-react";
import { FlatParticipant } from "@/types/flat-participant";

type ParticipantListProps = {
	form: UseFormReturn<OrderFormValues>;
	flatList: FlatParticipant[];
	buyerIsParticipant: boolean;
	buyerTicketGroupIdx: number;
	buyerEmail: string;
	onCopyBuyerEmail: (groupIdx: number, participantIdx: number) => void;
};

export const ParticipantList = ({
	form,
	flatList,
	buyerIsParticipant,
	buyerTicketGroupIdx,
	buyerEmail,
	onCopyBuyerEmail,
}: ParticipantListProps) => {
	const buyerData = form.watch("buyer");

	return (
		<div className="ticket-list flex flex-col gap-3">
			{flatList.map((flat) => {
				const isBuyerSlot =
					buyerIsParticipant &&
					flat.groupIdx === buyerTicketGroupIdx &&
					flat.participantIdx === 0;

				if (isBuyerSlot) {
					return (
						<TicketWrapper
							id={flat.ticket.id}
							key={`${flat.groupIdx}-${flat.participantIdx}`}
						>
							<div className="flex flex-col gap-3">
								<div className="flex items-center gap-2 text-sm font-semibold">
									<IconTicket className="size-5 text-primary" />
									<span>{flat.ticket.name}</span>
									<span className="text-muted-foreground font-normal">
										— bilet {flat.participantIdx + 1}/
										{flat.totalInGroup}
									</span>
								</div>
								<div className="grid grid-cols-2 gap-3 text-sm">
									<div className="flex flex-col gap-1">
										<span className="text-muted-foreground text-xs">
											Imię
										</span>
										<span className="font-medium">
											{buyerData.name || "—"}
										</span>
									</div>
									<div className="flex flex-col gap-1">
										<span className="text-muted-foreground text-xs">
											Nazwisko
										</span>
										<span className="font-medium">
											{buyerData.surname || "—"}
										</span>
									</div>
								</div>
								<div className="flex flex-col gap-1 text-sm">
									<span className="text-muted-foreground text-xs">
										Email
									</span>
									<span className="font-medium">
										{buyerData.email || "—"}
									</span>
								</div>
								<div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2">
									<IconUserCheck className="size-4 shrink-0" />
									<span>Dane z formularza zamawiającego</span>
								</div>
							</div>
						</TicketWrapper>
					);
				}

				return (
					<TicketWrapper
						id={`#${truncate(flat.ticket.id, 10)}`}
						key={`${flat.groupIdx}-${flat.participantIdx}`}
					>
						<ParticipantFormCard
							form={form}
							groupIdx={flat.groupIdx}
							participantIdx={flat.participantIdx}
							ticketName={flat.ticket.name}
							totalInGroup={flat.totalInGroup}
							buyerEmail={buyerEmail}
							onCopyBuyerEmail={() =>
								onCopyBuyerEmail(
									flat.groupIdx,
									flat.participantIdx,
								)
							}
						/>
					</TicketWrapper>
				);
			})}
		</div>
	);
};
