import { cn } from "@/lib/utils";
import React from "react";

const FormRow = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return <div className={cn("flex gap-2", className)}>{children}</div>;
};

export default FormRow;
