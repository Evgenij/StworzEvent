import { cn } from "@/lib/utils";
import React from "react";

const HeaderWrapper = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<div
			className={cn(
				"header-wrapper overflow-hidden relative px-6 py-5 bg-black text-white rounded-3xl",
				className,
			)}
		>
			<div
				className="opacity-5"
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
					backgroundSize: "80px 80px",
				}}
			></div>
			<div className="absolute opacity-80 -top-2/3 left-0 bg-primary w-1/2 h-full blur-[180px] rounded-full"></div>
			<div className="absolute opacity-50 -bottom-2/3 right-20 bg-purple-400 w-1/3 h-full blur-[150px] rounded-full"></div>
			<div className="content relative z-10">{children}</div>
		</div>
	);
};

export default HeaderWrapper;
