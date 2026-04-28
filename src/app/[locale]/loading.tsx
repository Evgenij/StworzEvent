"use client";

import { IconLoader } from "@tabler/icons-react";

const loading = () => {
	return (
		<div className="loading flex flex-col gap-2 items-center justify-center h-screen ">
			<IconLoader className="animate-spin" />
			<p className="text-muted-foreground">Ladowanie...</p>
		</div>
	);
};

export default loading;
