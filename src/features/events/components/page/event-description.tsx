import { RichTextRenderer } from "@/components/shared/rich-text-renderer";
import { Prisma } from "@prisma/client";
import React from "react";

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
