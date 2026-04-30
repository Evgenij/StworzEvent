import { z } from "zod";
import {
	paymentFieldsShape,
	refinePayment,
} from "@/lib/payment/payment-fields";

export const eventPaymentSchema = (t: (key: string) => string) =>
	z
		.object(paymentFieldsShape(t))
		.superRefine((data, ctx) => refinePayment(data, ctx, t));

export type EventPaymentInput = z.infer<ReturnType<typeof eventPaymentSchema>>;

export const eventPaymentServerSchema = eventPaymentSchema((k) => k);
