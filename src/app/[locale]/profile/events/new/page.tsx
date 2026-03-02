import { Separator } from "@/components/shadcn/ui/separator";
import { PageHeader } from "@/features/layout";
import React from "react";

const NewEventPage = () => {
	return (
		<section className="flex gap-4 w-full ">
			<div className="w-2/3  ">
				<PageHeader />
			</div>
			<Separator orientation="vertical" />
			<div className="w-1/3  ">preview</div>
		</section>
	);
};

export default NewEventPage;
