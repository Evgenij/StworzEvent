import { Typography } from "@/components/shared";
import { RichTextRenderer } from "@/components/shared/rich-text-renderer";
import { EventSection } from "@prisma/client";

const EventTextSection = ({ section }: { section: EventSection }) => (
	<div>
		<RichTextRenderer content={section.content} />
	</div>
);

export default EventTextSection;
