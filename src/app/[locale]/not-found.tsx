"use client";

import { Button } from "@/components/shadcn/ui/button";
import { Typography } from "@/components/shared";
import { useRouter } from "@/i18n/routing";
import { IconChevronLeft } from "@tabler/icons-react";

export default function NotFoundPage() {
	const router = useRouter();

	return (
		<div className="flex flex-col justify-center items-center h-screen">
			<img src="/images/not-found.svg" alt="not-found" className="w-sm" />
			<div className="wrapp flex flex-col items-center gap-5">
				<Typography variant="h2">Nie znaleziono strony</Typography>
				<Button onClick={() => router.back()}>
					<IconChevronLeft />
					Wróć
				</Button>
			</div>
		</div>
	);
}
