import React from "react";

const MobileMenuWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="sm:hidden fixed bottom-0 left-0 w-full h-37 bg-linear-to-t from-white from-30% to-transparent flex items-end justify-center p-5 ">
			{children}
		</div>
	);
};

export default MobileMenuWrapper;
