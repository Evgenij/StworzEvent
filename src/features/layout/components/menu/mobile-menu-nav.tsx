"use client";

import { ReactNode } from "react";
import MobileMenuItem, { MobileMenuItemProps } from "./mobile-menu-item";

type MobileMenuNavProps = {
	children: ReactNode;
};

export default function MobileMenuNav({ children }: MobileMenuNavProps) {
	return (
		<div className="flex w-full bg-white rounded-full p-1">{children}</div>
	);
}
