import Image from "next/image";
import React from "react";

type EventHeroSectionProps = {
	image: string | null;
};

const EventHeroSection = ({ image }: EventHeroSectionProps) => {
	return (
		<>
			<Image
				src={image || "/placeholder.jpg"}
				alt={image || "Event cover"}
				className="w-full h-125 object-cover rounded-4xl"
				width={0}
				height={0}
				sizes="100vw"
			/>
		</>
	);
};

export default EventHeroSection;
