import type { Currency, OrderStatus, PaymentMethod } from "@prisma/client";

export type OrganizerOrder = {
	id: string;
	orderNumber: string | null;
	email: string;
	status: OrderStatus;
	total: number;
	currency: Currency;
	paymentMethod: PaymentMethod | null;
	buyerName: string | null;
	buyerSurname: string | null;
	buyerPhone: string | null;
	cancelReason: string | null;
	createdAt: string;
	updatedAt: string;
	itemsCount: number;
	participantsCount: number;
	tickets: {
		id: string;
		name: string;
		quantity: number;
		price: number;
	}[];
};

export type OrganizerOrdersSummary = {
	total: number;
	pending: number;
	confirmed: number;
	paid: number;
	cancelled: number;
	expired: number;
	revenue: number;
};

export type OrganizerOrdersResult = {
	event: {
		id: string;
		title: string;
	};
	orders: OrganizerOrder[];
	summary: OrganizerOrdersSummary;
};
