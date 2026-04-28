import React from "react";

const EmptySection = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="rounded-xl w-full border-2 border-dashed p-5 text-center">
			<p className="text-sm text-muted-foreground">{children}</p>
		</div>
	);
};

export default EmptySection;
