import { TablerIcon } from "@tabler/icons-react";
import React from "react";
import { Separator } from "../shadcn/ui/separator";

const FormLabel = ({
	children,
	icon: Icon,
}: {
	children: React.ReactNode;
	icon?: TablerIcon;
}) => {
	return (
		<div className="text-muted-foreground flex items-center gap-2 text-sm ml-2">
			{Icon && <Icon className="size-5 text-primary" />}
			{children}
		</div>
	);
};

export default FormLabel;
