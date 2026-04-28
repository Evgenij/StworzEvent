import React from "react";
import FormLabel from "./form-label";
import { TablerIcon } from "@tabler/icons-react";

const FormGroup = ({
	children,
	className,
	label,
	icon,
}: {
	children: React.ReactNode;
	className?: string;
	label?: React.ReactNode;
	icon?: TablerIcon;
}) => {
	return (
		<div className={`flex flex-col gap-4 ${className}`}>
			{label && <FormLabel icon={icon}>{label}</FormLabel>}
			{children}
		</div>
	);
};

export default FormGroup;
