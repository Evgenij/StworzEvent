import { cn } from "@/lib/utils";
import React from "react";

const GridBg = ({ className }: { className?: string }) => {
	return (
		<div
			style={{
				position: "absolute",
				top: -1,
				right: 0,
				bottom: 0,
				left: -1,
				zIndex: 0,
				backgroundImage: `
        linear-gradient(to right, #e2e8f0 1px, transparent 1px),
        linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
      `,
				backgroundSize: "100px 100px",
				WebkitMaskImage:
					"linear-gradient(to right, #000 0%, transparent 30%, transparent 70%, #000 100%)",
				maskImage:
					"linear-gradient(to right, #000 0%, transparent 30%, transparent 70%, #000 100%)",
			}}
			className={cn("", className)}
		/>
	);
};

export default GridBg;
