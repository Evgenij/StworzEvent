import React from "react";
import { Button } from "@/shadcn/ui/button";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

interface ReturnBtnProps {
	href: string;
	label: string;
}

const ReturnBtn = ({ href, label }: ReturnBtnProps) => {
	return (
		<Button asChild variant={"outline"}>
			<Link href={href}>
				<IconArrowLeft />
				{label}
			</Link>
		</Button>
	);
};

export default ReturnBtn;
