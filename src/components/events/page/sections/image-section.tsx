"use client";

import { EventSection } from "@prisma/client";
import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { ImageSectionContent } from "../event-sections";

const EventImageSection = ({ section }: { section: EventSection }) => {
	const content = section.content as ImageSectionContent;
	const [open, setOpen] = useState(false);
	const [index, setIndex] = useState(0);

	const slides = content.images.map((img) => ({
		src: img.url,
		alt: img.alt,
	}));

	return (
		<>
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
				{content.images.map((image, i) => (
					<img
						key={i}
						src={image.url}
						alt={image.alt ?? ""}
						className="w-full rounded-md object-cover aspect-video cursor-pointer hover:opacity-90 transition-opacity"
						onClick={() => {
							setIndex(i);
							setOpen(true);
						}}
					/>
				))}
			</div>

			<Lightbox
				plugins={[Thumbnails]}
				open={open}
				close={() => setOpen(false)}
				index={index}
				slides={slides}
			/>
		</>
	);
};

export default EventImageSection;
