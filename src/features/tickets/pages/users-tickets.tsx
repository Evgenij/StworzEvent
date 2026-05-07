"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeaderWrapper } from "@/features/dashboard";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Typography } from "@/shared/components";
import {
	IconArrowRight,
	IconArrowsDownUp,
	IconCalendar,
	IconCalendarEvent,
	IconCancel,
	IconDownload,
	IconExternalLink,
	IconFilter,
	IconFlame,
	IconMapPin,
	IconQrcode,
	IconRoute,
	IconShieldCheck,
} from "@tabler/icons-react";
import { useState } from "react";
import Ticket, { TicketData } from "../components/ticket";
import WrapperFutureFunction from "@/features/layout/components/wrapper-future-function";

const stylesTickets = [
	"from-black to-zinc-700",
	"from-black to-sky-700",
	"from-lime-800 to-black",
	"from-black to-yellow-700",
	"from-orange-800 to-black",
	"from-cyan-600 to-black",
];

const tickets: TicketData[] = [
	{
		event: {
			name: "Wydarzenie 1",
			date: "2023-12-12",
			time: "10:00",
			location: "Stadion 1",
			price: 100,
			status: "active",
		},
		details: {
			buyer: "Anna Kowalska",
			orderId: "#WJN-7714",
		},
	},
];

const UsersTickets = () => {
	const [typeTicket, setTypeTicket] = useState("overview");

	return (
		<div className="users-tickets-page flex flex-col gap-6">
			<header className="header flex flex-col gap-4 lg:flex-row justify-between items-start lg:items-center">
				<div className="header__title">
					<Typography variant="h2">Twoj portfel</Typography>
					<p className="text-sm text-muted-foreground mt-2">
						Wszystkie Twoje wejściówki w jednym miejscu — pobierz,
						udostępnij lub przenieś.
					</p>
				</div>
				<div className="header__actions flex gap-2">
					<Button>
						<IconDownload /> Pobrac najbliższy bilet{" "}
					</Button>
				</div>
			</header>
			<main className="hero">
				<HeaderWrapper>
					<div className="content flex flex-col xl:flex-row gap-8 items-center">
						<div className="hero__title flex flex-col gap-2">
							<span className="opacity-50 mb-1">
								Dzień dobry, Anno 👋
							</span>
							<Typography variant="h1">
								Następne wydarzenie już{" "}
								<span className="text-primary">za 4 dni.</span>{" "}
								Zachowaj bilet pod ręką.
							</Typography>
							<p className="opacity-60 mt-1">
								Pokaż kod QR przy wejściu — pracownik zeskanuje
								go. Możesz też go pobrać z portfelu, by mieć go
								zawsze offline.
							</p>
						</div>
						<div className="hero__ticket w-full xl:w-2/3">
							<div className="ticket flex flex-col gap-2 bg-white rounded-2xl p-4 px-5 text-black relative">
								<div className="circle absolute size-6 rounded-full  top-1/2 -left-3 transform -translate-y-1/2 bg-[#1F1016]"></div>
								<div className="flex items-center gap-1 text-xs font-semibold text-primary uppercase">
									<IconFlame className="size-4" stroke={3} />
									Najbliższy bilet
								</div>
								<Link href="/events/1" className="no-underline">
									<Typography
										variant="h3"
										className="hover:underline cursor-pointer"
									>
										Warsaw Jazz Night 2026
									</Typography>
								</Link>
								<div className="flex gap-3 items-center font-medium text-muted-foreground text-xs">
									<div className="flex items-center gap-1">
										<IconCalendarEvent className="size-4" />{" "}
										pią. 3 marca · 19:00
									</div>
									<div className="flex items-center gap-1">
										<IconMapPin className="size-4" />
										Hydrozagadka
									</div>
								</div>
								<div className="flex flex-col items-center gap-1 mt-3">
									<div className="flex xl:flex-col w-full gap-1">
										<Button className="w-1/3 xl:w-full">
											<IconQrcode className="size-4" />
											Pokaż kod QR
										</Button>
										<div className="grid grid-cols-2 gap-1 w-full">
											<Button
												variant="outline"
												className="w-full"
											>
												<IconDownload className="size-4" />
												Pobierz bilet
											</Button>
											<Button
												variant="outline"
												className="w-full"
											>
												<IconRoute className="size-4" />
												Pokaz dojazd
											</Button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</HeaderWrapper>
			</main>
			<section className="main-content col-span-6 flex flex-col gap-4">
				<div className="ticket__search flex flex-col lg:flex-row gap-3 justify-between items-center">
					<Field
						orientation="horizontal"
						className="w-full xl:w-1/3 order-2 lg:order-1"
					>
						<Input
							type="search"
							placeholder="Search..."
							className="bg-background"
						/>
						<Button>Search</Button>
					</Field>
					<div className="filters w-full lg:w-fit flex gap-2 items-center order-1 lg:order-2">
						<Tabs
							defaultValue={typeTicket}
							onValueChange={setTypeTicket}
							className="w-full lg:w-fit "
						>
							<TabsList className="w-full">
								<TabsTrigger value="overview">
									Aktywne
									<Badge
										variant={
											typeTicket === "overview"
												? "default"
												: "outline"
										}
									>
										1
									</Badge>
								</TabsTrigger>
								<TabsTrigger value="analytics">
									Przeszłe
									<Badge
										variant={
											typeTicket === "analytics"
												? "default"
												: "outline"
										}
									>
										5
									</Badge>
								</TabsTrigger>
								<TabsTrigger value="reports">
									Anulowane{" "}
									<Badge
										variant={
											typeTicket === "reports"
												? "default"
												: "outline"
										}
									>
										2
									</Badge>
								</TabsTrigger>
							</TabsList>
						</Tabs>
						<div className="hidden xl:contents">
							<WrapperFutureFunction>
								<Button variant="outline">
									<IconFilter />
									Filtry
								</Button>
							</WrapperFutureFunction>
							<WrapperFutureFunction>
								<Button variant="outline">
									<IconArrowsDownUp />
									Najbliższe
								</Button>
							</WrapperFutureFunction>
						</div>
					</div>
				</div>
				<div className="tickets__list flex flex-col gap-3">
					{tickets.map((data, index) => (
						<Ticket
							data={data}
							key={index}
							className={
								stylesTickets[index % stylesTickets.length]
							}
						/>
					))}
				</div>
			</section>
		</div>
	);
};

export default UsersTickets;
