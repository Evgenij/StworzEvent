"use client";

import { EventSection } from "@prisma/client";
import { IconExternalLink, IconLink } from "@tabler/icons-react";
import { LINK_SERVICES } from "../../editor/sections/link-services";

type LinkItem = {
	url: string;
	service: string;
};

type LinksSectionContent = {
	links: LinkItem[];
};

const getServiceDef = (serviceId: string) =>
	LINK_SERVICES.find((s) => s.id === serviceId) ?? LINK_SERVICES[0];

const getHostname = (url: string) => {
	try {
		return new URL(url).hostname.replace(/^www\./, "");
	} catch {
		return url;
	}
};

const EventLinksSection = ({ section }: { section: EventSection }) => {
	const content = section.content as LinksSectionContent;

	if (!content?.links?.length) return null;

	return (
		<div className="flex flex-col gap-2">
			{content.links.map((link, i) => {
				const { Icon } = getServiceDef(link.service);

				return (
					<a
						key={i}
						href={link.url}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors hover:bg-muted"
					>
						<Icon className="size-5 shrink-0 text-muted-foreground" />
						<span className="flex-1 truncate font-medium">
							{getHostname(link.url)}
						</span>
						<IconExternalLink className="size-4 shrink-0 text-muted-foreground/50" />
					</a>
				);
			})}
		</div>
	);
};

export default EventLinksSection;
