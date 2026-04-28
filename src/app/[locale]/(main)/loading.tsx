"use client";

import { IconLoader } from "@tabler/icons-react";

const loading = () => {
	return (
		<div className="loading flex flex-col gap-2 items-center justify-center h-full text-muted-foreground">
			{/* <LottieAnimation className="w-100" /> */}
			<IconLoader className="animate-spin" />
			<p>Ladowanie...</p>
		</div>
	);
};

export default loading;
