import React from "react";
import FutureEventItem, { FutureEventItemType } from "./future-event-item";
import { WrapperFutureSection } from "@/features/layout";

const eventList: FutureEventItemType[] = [
	{
		id: 1,
		cover: null,
		title: "Event 1",
		date: "2023-01-01",
		location: "Location 1",
		registration: { expected: 100, actual: 56 },
	},
	{
		id: 2,
		cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdGvNlLLu9WU1r3yMaMIvkEgjvC7dgGVyt6A&s",
		title: "Event 2",
		date: "2023-02-01",
		location: "Location 2",
		registration: { expected: 200, actual: 62 },
	},
	{
		id: 3,
		cover: null,
		title: "Event 3",
		date: "2023-03-01",
		location: "Location 3",
		registration: { expected: 300, actual: 120 },
	},
];

const FutureEventsList = () => {
	return (
		<WrapperFutureSection>
			<div className="future-events-list flex flex-col divide-y">
				{eventList.map((event) => (
					<FutureEventItem key={event.id} event={event} />
				))}
			</div>
		</WrapperFutureSection>
	);
};

export default FutureEventsList;
