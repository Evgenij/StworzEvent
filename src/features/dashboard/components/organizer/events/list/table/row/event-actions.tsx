"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EVENT_EDIT_ROUTE, MAIN_PAGE_EVENT_ROUTE } from "@/config/routes";
import { useEventsListContext } from "@/features/dashboard/components/organizer/events/list/context/event-list-context";
import { deleteEventAction } from "@/features/events/actions/delete-event.action";
import { updateEventAction } from "@/features/events/actions/update-event.action";
import { Link, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { EventStatus } from "@prisma/client";
import {
	IconArchive,
	IconArrowBack,
	IconBroadcast,
	IconCancel,
	IconCircleCheck,
	IconDots,
	IconEdit,
	IconExternalLink,
	IconPlayerPause,
	IconPlayerPlay,
	IconPlayerStop,
	IconTrash,
} from "@tabler/icons-react";
import { ComponentType, TransitionStartFunction, useTransition } from "react";

type EventActionsType = {
	label: string;
	icon: ComponentType<{ className?: string }>;
	disabled?: boolean;
	callback: () => void;
	variant?: "default" | "destructive";
};

type ActionDeps = {
	eventId: string;
	router: ReturnType<typeof useRouter>;
	startTransition: TransitionStartFunction;
	refetch: () => void;
};

const navigate = (router: ReturnType<typeof useRouter>, path: string) => () =>
	router.push(path);

const changeStatus = (deps: ActionDeps, status: EventStatus) => () =>
	deps.startTransition(async () => {
		const result = await updateEventAction({
			eventId: deps.eventId,
			data: { status },
		});
		if (result.success) deps.refetch();
	});

const deleteEvent = (deps: ActionDeps) => () =>
	deps.startTransition(async () => {
		const result = await deleteEventAction({ eventId: deps.eventId });
		if (result.success) deps.refetch();
	});

const getEventsActions = (
	deps: ActionDeps,
): Record<EventStatus, (EventActionsType | null)[]> => ({
	[EventStatus.DRAFT]: [
		{
			label: "Kontynuuj tworzenie",
			icon: IconEdit,
			callback: navigate(deps.router, EVENT_EDIT_ROUTE(deps.eventId)),
		},
		null,
		{
			label: "Usuń szkic",
			icon: IconTrash,
			callback: deleteEvent(deps),
			variant: "destructive",
		},
	],

	[EventStatus.UNPUBLISHED]: [
		{
			label: "Opublikuj",
			icon: IconPlayerPlay,
			callback: changeStatus(deps, EventStatus.PUBLISHED),
		},
		null,
		{
			label: "Archiwizuj",
			icon: IconArchive,
			callback: changeStatus(deps, EventStatus.ARCHIVED),
		},
		null,
		{
			label: "Usuń wydarzenie",
			icon: IconTrash,
			callback: deleteEvent(deps),
			variant: "destructive",
		},
	],

	[EventStatus.PUBLISHED]: [
		{
			label: "Otwórz sprzedaż",
			icon: IconPlayerPlay,
			callback: changeStatus(deps, EventStatus.SALES_OPEN),
		},
		{
			label: "Cofnij publikację",
			icon: IconArrowBack,
			callback: changeStatus(deps, EventStatus.UNPUBLISHED),
		},
		null,
		{
			label: "Usuń wydarzenie",
			icon: IconTrash,
			callback: deleteEvent(deps),
			variant: "destructive",
		},
	],

	[EventStatus.SALES_OPEN]: [
		{
			label: "Wstrzymaj sprzedaż",
			icon: IconPlayerPause,
			callback: changeStatus(deps, EventStatus.SALES_PAUSED),
		},
		{
			label: "Zamknij sprzedaż",
			icon: IconCancel,
			callback: changeStatus(deps, EventStatus.SALES_CLOSED),
		},
		null,
		{
			label: "Usuń wydarzenie",
			icon: IconTrash,
			callback: deleteEvent(deps),
			variant: "destructive",
			disabled: true,
		},
	],

	[EventStatus.SALES_PAUSED]: [
		{
			label: "Wznów sprzedaż",
			icon: IconPlayerPlay,
			callback: changeStatus(deps, EventStatus.SALES_OPEN),
		},
		{
			label: "Zamknij sprzedaż",
			icon: IconPlayerStop,
			callback: changeStatus(deps, EventStatus.SALES_CLOSED),
		},
		null,
		{
			label: "Usuń wydarzenie",
			icon: IconTrash,
			callback: deleteEvent(deps),
			variant: "destructive",
			disabled: true,
		},
	],

	[EventStatus.SALES_CLOSED]: [
		{
			label: "Wznów sprzedaż",
			icon: IconPlayerPlay,
			callback: changeStatus(deps, EventStatus.SALES_OPEN),
		},
		{
			label: "Oznacz jako na żywo",
			icon: IconBroadcast,
			callback: changeStatus(deps, EventStatus.LIVE),
		},
		null,
		{
			label: "Odwolaj wydarzenie",
			icon: IconCancel,
			callback: changeStatus(deps, EventStatus.CANCELLED),
		},
		null,
		{
			label: "Usuń wydarzenie",
			icon: IconTrash,
			callback: deleteEvent(deps),
			variant: "destructive",
			disabled: true,
		},
	],

	[EventStatus.LIVE]: [
		{
			label: "Zakończ wydarzenie",
			icon: IconCircleCheck,
			callback: changeStatus(deps, EventStatus.COMPLETED),
		},
		null,
		{
			label: "Usuń wydarzenie",
			icon: IconTrash,
			callback: deleteEvent(deps),
			variant: "destructive",
			disabled: true,
		},
	],

	[EventStatus.COMPLETED]: [
		{
			label: "Archiwizuj",
			icon: IconArchive,
			callback: changeStatus(deps, EventStatus.ARCHIVED),
		},
		null,
		{
			label: "Usuń wydarzenie",
			icon: IconTrash,
			callback: deleteEvent(deps),
			variant: "destructive",
			disabled: true,
		},
	],

	[EventStatus.CANCELLED]: [
		{
			label: "Archiwizuj",
			icon: IconArchive,
			callback: changeStatus(deps, EventStatus.ARCHIVED),
		},
		null,
		{
			label: "Usuń wydarzenie",
			icon: IconTrash,
			callback: deleteEvent(deps),
			variant: "destructive",
			disabled: true,
		},
	],

	[EventStatus.ARCHIVED]: [
		{
			label: "Przywróć do szkicu",
			icon: IconArrowBack,
			callback: changeStatus(deps, EventStatus.DRAFT),
		},
		null,
		{
			label: "Usuń wydarzenie",
			icon: IconTrash,
			callback: deleteEvent(deps),
			variant: "destructive",
			disabled: true,
		},
	],
});

const EventActions = ({
	slug,
	eventId,
	status,
	className,
}: {
	slug: string;
	eventId: string;
	status: EventStatus;
	className?: string;
}) => {
	const router = useRouter();
	const [, startTransition] = useTransition();
	const { refetch } = useEventsListContext();

	const actions =
		getEventsActions({ eventId, router, startTransition, refetch })[
			status
		] ?? [];

	return (
		<div className={cn("event-actions flex gap-1 justify-end", className)}>
			<Button size="icon-sm" variant="ghost" asChild>
				<Link href={MAIN_PAGE_EVENT_ROUTE(slug)}>
					<IconExternalLink />
				</Link>
			</Button>
			<Button size="icon-sm" variant="outline" asChild>
				<Link href={EVENT_EDIT_ROUTE(eventId)}>
					<IconEdit />
				</Link>
			</Button>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="icon-sm">
						<IconDots />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					{actions.length > 0 && (
						<DropdownMenuGroup>
							{actions.map((action, index) => {
								if (action === null) {
									return (
										<DropdownMenuSeparator key={index} />
									);
								}
								const Icon = action.icon;
								return (
									<DropdownMenuItem
										key={action.label}
										variant={action.variant}
										onClick={action.callback}
										disabled={action.disabled}
									>
										<Icon />
										{action.label}
									</DropdownMenuItem>
								);
							})}
						</DropdownMenuGroup>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default EventActions;
