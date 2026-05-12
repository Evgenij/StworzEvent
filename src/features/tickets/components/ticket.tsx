import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Typography } from "@/shared/components";
import { IconDownload, IconMapPin, IconShieldCheck } from "@tabler/icons-react";

import { PaymentMethod } from "@prisma/client";
import OrderTicketStatus from "./order-ticket-status";

export type TicketData = {
	event: {
		name: string;
		date: string;
		time: string;
		location: string;
		price: number;
		status: string;
	};
	details: {
		buyer: string;
		orderId: string;
	};
};

const Ticket = ({
	className,
	data,
}: {
	className?: string;
	data: TicketData;
}) => {
	return (
		<div className="tickets__list-item flex rounded-2xl bg-white overflow-hidden">
			<div
				className={cn(
					"aside flex flex-col justify-between relative border border-border w-1/5 p-4 px-5 bg-linear-to-br text-white",
					className,
				)}
			>
				<div className="circle absolute border border-border size-6 rounded-full top-0 -right-3 transform -translate-y-1/2 bg-background"></div>
				<div className="circle absolute border border-border size-6 rounded-full bottom-0 -right-3 transform translate-y-1/2 bg-background"></div>
				<div className="wrapper title">
					<span className="text-sm uppercase opacity-50">
						koncert
					</span>
					<Typography variant="h3">{data.event.name}</Typography>
				</div>
				<div className="details flex flex-col gap-1">
					<div className="date p-2 px-3 bg-white/10 rounded-lg w-fit">
						{data.event.date} · {data.event.time}
					</div>
					<div className="location text-sm flex items-center gap-1 ml-1">
						<IconMapPin className="size-4" />
						{data.event.location}
					</div>
				</div>
			</div>
			<div className="content flex w-4/5 divide-dashed divide-x-2 border border-border border-l-0 rounded-r-2xl">
				<div className="data w-3/4 flex flex-col gap-2 p-4 px-5">
					{/* <div className="data-labels">Bilet</div> */}
					<main className="data-details grid grid-cols-3 gap-3">
						<div className="data-details__item">
							<span className="data-details__item-label text-sm uppercase opacity-50 tracking-wider">
								Kupiacy
							</span>
							<p className="data-details__item-value  font-medium">
								{data.details.buyer}
							</p>
						</div>
						<div className="data-details__item">
							<span className="data-details__item-label text-sm uppercase opacity-50 tracking-wider">
								Zamówienie
							</span>
							<p className="data-details__item-value font-medium">
								#WJN-7714
							</p>
						</div>
						<div className="data-details__item">
							<span className="data-details__item-label text-sm uppercase opacity-50 tracking-wider">
								Ilosc biletow
							</span>
							<p className="data-details__item-value font-medium">
								x2
							</p>
						</div>
						<div className="data-details__item col-span-2">
							<span className="data-details__item-label text-sm uppercase opacity-50 tracking-wider">
								Kupiono
							</span>
							<p className="data-details__item-value font-medium">
								12 lutego 2026 14:23
							</p>
						</div>
						<div className="data-details__item">
							<span className="data-details__item-label text-sm uppercase opacity-50 tracking-wider">
								Razem
							</span>
							<p className="data-details__item-value font-medium">
								650 zl
							</p>
						</div>

						<div className="data-details__item col-span-3">
							<Accordion type="single" collapsible>
								<AccordionItem value="shipping">
									<AccordionTrigger>
										<span className="data-details__item-label text-sm uppercase opacity-50 tracking-wider">
											Lista uczestnikow (x2)
										</span>
									</AccordionTrigger>
									<AccordionContent className="h-fit p-0">
										<div className="data-details__participants flex flex-col text-muted-foreground">
											<div className="data-details__participants-item grid grid-cols-4 justify-between text-sm">
												<span>Anna Nowak</span>
												<span className="text-center">
													VIP bilet
												</span>
												<span className="underline text-center">
													V-0143-2026
												</span>
												<span className="text-right">
													450 zl
												</span>
											</div>
											<div className="data-details__participants-item grid grid-cols-4 justify-between text-sm">
												<span>Oliver Nowak</span>
												<span className="text-center">
													Standart
												</span>
												<span className="underline text-center">
													V-0128-2026
												</span>
												<span className="text-right">
													200 zl
												</span>
											</div>
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</div>
					</main>
					<Separator />
					<footer className="data-actions">
						<OrderTicketStatus
							status="PENDING"
							paymentMethod={PaymentMethod.BANK_TRANSFER}
						/>
					</footer>
				</div>
				<div className="code w-1/4 p-4 px-5">3</div>
			</div>
		</div>
	);
};

export default Ticket;
