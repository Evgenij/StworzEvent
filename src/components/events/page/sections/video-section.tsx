"use client";

import { EventSection } from "@prisma/client";
import React, { useState } from "react";
import { VideoSectionContent } from "../event-sections";

const getYoutubeId = (url: string) => {
	const match = url.match(/(?:v=|youtu\.be\/)([^&\n?#]+)/);
	return match?.[1] ?? "";
};

const EventVideoSection = ({ section }: { section: EventSection }) => {
	const content = section.content as VideoSectionContent;

	return (
		<div className="flex flex-col gap-4">
			{content.videos.map((video, i) => (
				<div key={i} className="flex flex-col gap-2">
					{/* {video.title && (
						<p className="font-medium">{video.title}</p>
					)} */}
					<div className="aspect-video rounded-md overflow-hidden">
						<iframe
							src={`https://www.youtube.com/embed/${getYoutubeId(video.url)}`}
							className="w-full h-full"
							allowFullScreen
							allow="autoplay; encrypted-media"
						/>
					</div>
				</div>
			))}
		</div>
	);
};

export default EventVideoSection;
