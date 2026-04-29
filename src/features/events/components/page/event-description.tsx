import { RichTextRenderer } from "@/shared/components/rich-text-renderer";
import { Prisma } from "@prisma/client";

type EventDescriptionSectionProps = {
	description: Prisma.JsonValue | null;
};

const EventDescriptionSection = ({
	description,
}: EventDescriptionSectionProps) => {
	if (!description) return null;
	return <RichTextRenderer content={description} editable={false} />;
};

export default EventDescriptionSection;
