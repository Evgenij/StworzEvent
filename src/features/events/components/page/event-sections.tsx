import { Typography } from "@/shared/components";
import { EventSection, SectionType } from "@prisma/client";
import React from "react";
import EventTextSection from "./sections/text-section";
import EventImageSection from "./sections/image-section";
import EventVideoSection from "./sections/video-section";
import EventLinksSection from "./sections/links-section";

const sectionComponents: Record<
	SectionType,
	React.FC<{ section: EventSection }>
> = {
	[SectionType.TEXT]: EventTextSection,
	[SectionType.LINKS]: EventLinksSection,
	[SectionType.IMAGE]: EventImageSection,
	[SectionType.VIDEO]: EventVideoSection,
};

export type TextSectionContent = {
	type: "doc";
	content: any[]; // Tiptap JSON
};

export type ImageSectionContent = {
	images: {
		url: string;
		alt?: string;
		caption?: string;
	}[];
};

export type VideoSectionContent = {
	videos: {
		url: string; // YouTube URL
		title?: string;
	}[];
};

export type SectionContent =
	| TextSectionContent
	| ImageSectionContent
	| VideoSectionContent;

const EventSectionsSection = ({ sections }: { sections: EventSection[] }) => {
	return (
		<div className="flex flex-col gap-9">
			{sections.map((section) => {
				const SectionComponent = sectionComponents[section.type];
				return (
					<section key={section.id}>
						{section.title && (
							<h3 className="text-xl font-bold mb-4">
								{section.title}
							</h3>
						)}
						<SectionComponent section={section} />
					</section>
				);
			})}
		</div>
	);
};

export default EventSectionsSection;
