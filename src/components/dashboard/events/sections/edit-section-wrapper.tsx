"use client";

import { Label } from "@/components/shadcn/ui/label";
import { Switch } from "@/components/shadcn/ui/switch";
import { Typography } from "@/components/shared";
import React, { useState } from "react";

type EditSectionWrapperProps = { title: string; children: React.ReactNode };

const EditSectionWrapper = ({ title, children }: EditSectionWrapperProps) => {
	const [isOpened, setIsCheckOpened] = useState(true);

	return (
		<section className="flex flex-col border-b border-border">
			<div className="trigger flex gap-2 items-center py-4">
				<Switch
					id={`switcher-section-${title}`}
					checked={isOpened}
					onCheckedChange={(val) => setIsCheckOpened(val)}
				/>
				<Label
					htmlFor={`switcher-section-${title}`}
					className="cursor-pointer"
				>
					<Typography variant="h4">{title}</Typography>
				</Label>
			</div>

			{isOpened && <div className="content pb-5">{children}</div>}
		</section>
	);
};

export default EditSectionWrapper;
