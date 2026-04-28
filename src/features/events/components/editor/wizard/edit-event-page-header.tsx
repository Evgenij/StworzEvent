"use client";

import { usePathname } from "next/navigation";
import { Typography } from "@/components/shared";

type Props = {
	eventTitle: string;
};

export function EditEventPageHeader({ eventTitle }: Props) {
	const pathname = usePathname();

	const stepTitle = pathname.includes("/edit/tickets")
		? "Konfiguracja biletów"
		: pathname.includes("/edit/additional")
			? "Dodaj media i agendę"
			: "Wydarzenie";

	return (
		<Typography variant="h2" className="line-clamp-1">
			<p className="font-normal text-muted-foreground inline mr-2">
				{stepTitle}:
			</p>{" "}
			{eventTitle}
		</Typography>
	);
}
