"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cancelOrderAction } from "@/features/orders/actions/cancel-order.action";
import { confirmOrderAction } from "@/features/orders/actions/confirm-order.action";
import { OrderStatus } from "@prisma/client";
import { Check, Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type OrderActionsProps = {
	eventId: string;
	orderId: string;
	status: OrderStatus;
};

export function OrderActions({ eventId, orderId, status }: OrderActionsProps) {
	const t = useTranslations("OrganizerOrders.actions");
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [isCancelOpen, setIsCancelOpen] = useState(false);
	const [reason, setReason] = useState("");

	const canConfirm = status === OrderStatus.PENDING;
	const canCancel = status !== OrderStatus.CANCELLED;

	const confirmOrder = () => {
		startTransition(async () => {
			const result = await confirmOrderAction({ eventId, orderId });

			if (!result.success) {
				toast.error(t("confirmFailed"));
				return;
			}

			toast.success(t("confirmed"));
			router.refresh();
		});
	};

	const cancelOrder = () => {
		startTransition(async () => {
			const result = await cancelOrderAction({
				eventId,
				orderId,
				reason,
			});

			if (!result.success) {
				toast.error(t("cancelFailed"));
				return;
			}

			toast.success(t("cancelled"));
			setReason("");
			setIsCancelOpen(false);
			router.refresh();
		});
	};

	return (
		<div className="flex justify-end gap-2">
			<Button
				type="button"
				size="sm"
				variant="outline"
				disabled={!canConfirm || isPending}
				onClick={confirmOrder}
			>
				{isPending ? (
					<Loader2 className="size-3.5 animate-spin" />
				) : (
					<Check className="size-3.5" />
				)}
				{t("confirm")}
			</Button>

			<Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
				<DialogTrigger asChild>
					<Button
						type="button"
						size="sm"
						variant="destructive"
						disabled={!canCancel || isPending}
					>
						<X className="size-3.5" />
						{t("cancel")}
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("cancelTitle")}</DialogTitle>
						<DialogDescription>
							{t("cancelDescription")}
						</DialogDescription>
					</DialogHeader>
					<Textarea
						value={reason}
						onChange={(event) => setReason(event.target.value)}
						placeholder={t("reasonPlaceholder")}
						rows={4}
					/>
					<DialogFooter>
						<DialogClose asChild>
							<Button type="button" variant="outline">
								{t("close")}
							</Button>
						</DialogClose>
						<Button
							type="button"
							variant="destructive"
							disabled={reason.trim().length < 3 || isPending}
							onClick={cancelOrder}
						>
							{isPending && (
								<Loader2 className="size-3.5 animate-spin" />
							)}
							{t("cancelConfirm")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
