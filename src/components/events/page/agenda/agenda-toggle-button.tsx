import { Button } from "@/components/shadcn/ui/button";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import React from "react";

// Вынесли кнопку в отдельный компонент
const AgendaToggleButton = React.forwardRef<
	HTMLDivElement,
	{
		open: boolean;
		onOpen: () => void;
		onClose: () => void;
	}
>(({ open, onOpen, onClose }, ref) => (
	<div
		ref={ref}
		className="toggle-wrapper relative h-20 transform -translate-y-full flex items-end justify-center w-full bg-linear-to-t from-white to-transparent border-b rounded-2xl pointer-events-none"
	>
		<Button
			className="absolute -bottom-1/2 -translate-y-1/2 pointer-events-auto"
			variant="outline"
			onClick={open ? onClose : onOpen}
		>
			{open ? <IconChevronUp /> : <IconChevronDown />}
			{open ? "Ukryj agendę" : "Pokaż agendę"}
		</Button>
	</div>
));

export default AgendaToggleButton;
