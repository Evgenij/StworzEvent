"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/shadcn/ui/alert-dialog";
import { Button } from "@/components/shadcn/ui/button";
import { Label } from "@/components/shadcn/ui/label";
import { Switch } from "@/components/shadcn/ui/switch";
import { Typography } from "@/components/shared";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

type EditSectionWrapperProps = {
	active: boolean;
	countItems: number;
	title: string;
	children: React.ReactNode;
	className?: string;
	onCheckedChange: (val: boolean) => void;
};

const EditSectionWrapper = ({
	active,
	countItems,
	title,
	children,
	className,
	onCheckedChange,
}: EditSectionWrapperProps) => {
	// const [isOpened, setIsCheckOpened] = useState(active);

	return (
		<section
			className={cn("flex flex-col border-b border-border", className)}
		>
			<div className="trigger flex gap-2 items-center py-4">
				<Switch
					id={`switcher-section-${title}`}
					checked={active}
					onCheckedChange={(val) => onCheckedChange(val)}
				/>
				<Label
					htmlFor={`switcher-section-${title}`}
					className="cursor-pointer flex gap-3"
				>
					<Typography variant="h4">{title}</Typography>
					{countItems > 0 && (
						<span className="text-sm text-muted-foreground">
							{countItems} element(ów)
						</span>
					)}
				</Label>
			</div>

			{active && <div className="content pb-5">{children}</div>}
		</section>
	);
};

export default EditSectionWrapper;
