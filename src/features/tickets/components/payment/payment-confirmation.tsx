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
import { Typography } from "@/shared/components";
import {
	IconCameraUp,
	IconCopy,
	IconSend,
	IconUpload,
} from "@tabler/icons-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import ConfirmationUpload from "./confirmation-upload";

type ConfirmationFormInput = {
	confirmationImage: string | null;
	note: string;
};

type BankDetails = {
	accountNumber: string;
	transferTitle: string;
	amount: string;
};

type Props = {
	orderId?: string;
	eventName?: string;
	bank?: BankDetails;
};

const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

const PaymentConfirmation = ({
	orderId = "FE-0772",
	eventName = "Frontend Days 2026",
	bank = {
		accountNumber: "PL 12 1140 2004 0000 3002 0135 5432",
		transferTitle: `${orderId ?? "FE-0772"} · Anna Kowalska`,
		amount: "390,00 PLN",
	},
}: Props) => {
	const { control, handleSubmit, register } = useForm<ConfirmationFormInput>({
		defaultValues: {
			confirmationImage: null,
			note: "",
		},
	});

	const onSubmit: SubmitHandler<ConfirmationFormInput> = async (data) => {
		console.log(data);
	};

	return (
		<div className="payment-confirmation flex justify-between items-center gap-2 border border-border p-3 rounded-xl">
			<div className="payment-confirmation__title flex gap-1 items-center">
				<IconCameraUp className="size-5 text-primary" />
				<Typography variant="h4">Potwierdzenie płatności</Typography>
			</div>
			<div className="payment-confirmation__content">
				<Dialog>
					<DialogTrigger asChild>
						<Button>
							<IconUpload className="size-5" /> Dodaj
							potwierdzenie płatności
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-2xl">
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="flex flex-col gap-4"
						>
							<DialogHeader>
								<DialogTitle className="flex items-center gap-2 font-semibold">
									<div className="icon p-2 bg-primary/20 rounded-md">
										<IconCameraUp className="size-5 text-primary" />
									</div>
									Dodaj potwierdzenie przelewu
								</DialogTitle>
								<DialogDescription>
									Zamówienie #{orderId} · {eventName} ·{" "}
									{bank.amount}
								</DialogDescription>
							</DialogHeader>

							<div className="flex flex-col gap-1 rounded-xl border border-border p-4 text-sm">
								<div className="flex items-center justify-between gap-2 py-1">
									<span className="text-muted-foreground shrink-0">
										Numer konta
									</span>
									<div className="flex items-center gap-1.5 font-medium">
										<span className="truncate">
											{bank.accountNumber.replace(
												/(\w{2} \w{4} \w{4}).+(\w{4})$/,
												"$1 … $2",
											)}
										</span>
										<button
											type="button"
											onClick={() =>
												copyToClipboard(
													bank.accountNumber,
												)
											}
											className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
										>
											<IconCopy className="size-3.5" />
										</button>
									</div>
								</div>
								<div className="flex items-center justify-between gap-2 py-1">
									<span className="text-muted-foreground shrink-0">
										Tytuł przelewu
									</span>
									<div className="flex items-center gap-1.5 font-medium text-primary">
										<span>{bank.transferTitle}</span>
										<button
											type="button"
											onClick={() =>
												copyToClipboard(
													bank.transferTitle,
												)
											}
											className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
										>
											<IconCopy className="size-3.5" />
										</button>
									</div>
								</div>
								<div className="flex items-center justify-between gap-2 py-1">
									<span className="text-muted-foreground shrink-0">
										Kwota
									</span>
									<span className="font-semibold">
										{bank.amount}
									</span>
								</div>
							</div>

							<Controller
								control={control}
								name="confirmationImage"
								render={({ field }) => (
									<ConfirmationUpload
										value={field.value || ""}
										onChange={field.onChange}
										onClear={() => field.onChange(null)}
									/>
								)}
							/>

							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">
									Notatka dla organizatora{" "}
									<span className="text-muted-foreground font-normal">
										(opcjonalnie)
									</span>
								</label>
								<Textarea
									{...register("note")}
									placeholder='Np. „Przelew z konta firmowego — proszę o fakturę na NIP 1234567890"'
									className="resize-none text-sm"
									rows={3}
								/>
							</div>

							<DialogFooter className="flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
								<p className="text-xs text-muted-foreground order-last sm:order-first">
									Twój screenshot jest zaszyfrowany i widoczny
									tylko dla organizatora wydarzenia.
								</p>
								<div className="flex gap-2 shrink-0">
									<DialogClose asChild>
										<Button variant="outline">
											Anuluj
										</Button>
									</DialogClose>
									<Button type="submit">
										<IconSend className="size-4" />
										Wyślij potwierdzenie
									</Button>
								</div>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
};

export default PaymentConfirmation;
