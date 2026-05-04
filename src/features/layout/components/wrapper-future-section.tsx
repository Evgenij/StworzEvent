import { IconLockFilled } from "@tabler/icons-react";
import React, { ReactNode } from "react";

const WrapperFutureSection = ({ children }: { children: ReactNode }) => {
	return (
		<div className="relative">
			<div className="wrapper-content opacity-30">{children}</div>
			<div className="absolute flex gap-1 items-center justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 px-3 bg-white text-sm font-medium border border-border rounded-full w-max">
				<IconLockFilled className="text-muted-foreground size-5" />
				Dostepne w nastepnej aktualizacji
			</div>{" "}
		</div>
	);
};

export default WrapperFutureSection;
