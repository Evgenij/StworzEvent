import React from "react";
import LiveActionItem, { LiveActionItemType } from "./live-action-item";
import { WrapperFutureSection } from "@/features/layout";

const mockActions: LiveActionItemType[] = [
	{
		id: "1",
		type: "ORDER_PAID",
		participant: "Marek Kowalski",
		ticketCount: 2,
		ticketType: "Standard",
		event: "Warsaw Jazz Night",
		amount: 240,
		timestamp: "2 min",
	},
	{
		id: "2",
		type: "CHECKED_IN",
		participant: "Anna Nowak",
		gender: "f",
		ticketNumber: "JZ-1842",
		timestamp: "14 min",
	},
	{
		id: "3",
		type: "ORDER_PAID",
		participant: "Piotr Lis",
		ticketCount: 1,
		ticketType: "VIP",
		event: "Warsaw Jazz Night",
		amount: 320,
		timestamp: "31 min",
	},
	{
		id: "4",
		type: "ORDER_PAID",
		participant: "Karolina M.",
		ticketCount: 4,
		ticketType: "Standard",
		event: "Tech Summit",
		amount: 1200,
		timestamp: "1 h",
	},
	{
		id: "5",
		type: "REFUND",
		recipient: "Tomek W.",
		event: "Open Mic Night",
		amount: 80,
		timestamp: "2 h",
	},
	{
		id: "6",
		type: "CHECKED_IN",
		participant: "Dariusz B.",
		gender: "m",
		ticketNumber: "JZ-1837",
		timestamp: "3 h",
	},
	{
		id: "7",
		type: "ORDER_PAID",
		participant: "Magda P.",
		ticketCount: 2,
		ticketType: "Wczesny ptak",
		event: "Festiwal Książki",
		amount: 180,
		timestamp: "4 h",
	},
];

const LiveActionList = () => {
	return (
		<WrapperFutureSection>
			<div className="live-action-list relative flex flex-col">
				<div className="absolute left-[18px] top-9 bottom-9 w-px bg-border z-0" />
				{mockActions.map((action) => (
					<LiveActionItem key={action.id} action={action} />
				))}
			</div>
		</WrapperFutureSection>
	);
};

export default LiveActionList;
