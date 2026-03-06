import { API_ROUTES } from "@/app/api/apiRoutes";
import { apiFetcher } from "@/app/api/fetcher";
import {
	EventDescriptionSection,
	EventHeaderSection,
	EventHeroSection,
} from "@/components/events/page";
import Breadcrumb, {
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/shadcn/ui/breadcrumb";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/shadcn/ui/tooltip";
import { Typography } from "@/components/shared";
import prisma from "@/lib/prisma";
import { truncate } from "@/lib/utils";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import useSWR from "swr";

const EventPage = async ({
	params,
}: {
	params: Promise<{ id: string; locale: string }>;
}) => {
	const { id, locale } = await params;

	const event = await prisma.event.findUnique({
		where: { id },
		include: {
			categories: {
				include: {
					category: true, // достаём саму категорию из join-таблицы
				},
			},
			organization: true,
			tickets: true,
			eventFaqs: {
				orderBy: { order: "asc" },
			},
		},
	});

	if (!event) {
		notFound();
	}

	const categories = event?.categories?.map((item) => item.category) || [];

	return (
		<div className="max-w-6xl mx-auto flex flex-col gap-5">
			<div className="w-full px-5">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="#">Katalog</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink href="#">
								{categories
									.filter((item) => item.parentId === null)
									.map((item) => item.name)
									.join(" / ")}
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<Tooltip>
								<TooltipTrigger asChild>
									<BreadcrumbPage>
										{truncate(event.title, 10)}
									</BreadcrumbPage>
								</TooltipTrigger>
								<TooltipContent>
									<p>{event.title}</p>
								</TooltipContent>
							</Tooltip>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			<EventHeroSection image={event.coverImage ?? "/placeholder.jpg"} />
			<div className="event-data px-5">
				<EventHeaderSection
					title={event.title}
					categories={categories}
					locale={locale}
				/>
				<EventDescriptionSection description={event.description} />
			</div>
			<pre>{JSON.stringify(event, null, 2)}</pre>
			<pre>{JSON.stringify(categories, null, 2)}</pre>
		</div>
	);
};

export default EventPage;
