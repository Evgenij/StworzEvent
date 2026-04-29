import { RichTextRenderer } from "@/shared/components/rich-text-renderer";
import { EventSection } from "@prisma/client";

const EventTextSection = ({ section }: { section: EventSection }) => (
	<div>
		<RichTextRenderer content={section.content} />
	</div>
);

export default EventTextSection;
