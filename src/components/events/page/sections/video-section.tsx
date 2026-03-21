"use client";

import { EventSection } from "@prisma/client";
import React from "react";

type VideoSectionContent = {
	url: string;
};

const getYoutubeId = (url: string) => {
	const match = url.match(/(?:v=|youtu\.be\/)([^&\n?#]+)/);
	return match?.[1] ?? "";
};

const EventVideoSection = ({ section }: { section: EventSection }) => {
	const content = section.content as VideoSectionContent;

	if (!content?.url) return null;

	return (
		<div className="aspect-video overflow-hidden rounded-md">
			<iframe
				src={`https://www.youtube.com/embed/${getYoutubeId(content.url)}`}
				className="h-full w-full"
				allowFullScreen
				allow="autoplay; encrypted-media"
			/>
		</div>
	);
};

export default EventVideoSection;
