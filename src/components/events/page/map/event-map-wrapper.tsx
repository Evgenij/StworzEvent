"use client";

import dynamic from "next/dynamic";

const EventMapSection = dynamic(
	() => import("@/components/events/page/map/event-map"),
	{ ssr: false },
);

export { EventMapSection };
