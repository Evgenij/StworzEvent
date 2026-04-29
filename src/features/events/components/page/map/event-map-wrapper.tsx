"use client";

import dynamic from "next/dynamic";

const EventMapSection = dynamic(
	() => import("@/features/events/components/page/map/event-map"),
	{ ssr: false },
);

export { EventMapSection };
