import { cn } from "@/lib/utils";
import { Typography } from "@/shared/components";
import { IconBuildingBank, IconCopy } from "@tabler/icons-react";

const PaymentMethodTransfer = ({ className }: { className?: string }) => {
	return (
		<div
			className={cn(
				"payment-method-transfer flex flex-col gap-2",
				className,
			)}
		>
			<div className="payment-method-transfer__title flex gap-1 items-center pl-2">
				<IconBuildingBank className="size-5 text-primary" />
				<Typography variant="h4">Przelew bankowy</Typography>
			</div>
			<div className="payment-method-transfer__content grid grid-cols-1 p-2 border border-primary/20 bg-primary/5 rounded-lg divide-y divide-primary/30 text-muted-foreground text-xs">
				<div className="row py-2 pt-0 flex items-center justify-between">
					<span>Odbiorca</span>
					<p className="text-black group font-medium text-sm flex items-center gap-1 cursor-pointer">
						Jan Kowalski
						<IconCopy className="size-4 text-muted-foreground group-hover:text-primary" />
					</p>
				</div>
				<div className="row py-2 flex items-center justify-between">
					<span>Numer konta</span>
					<p className="text-black group font-semibold text-sm flex items-center gap-1 cursor-pointer font-mono">
						PL 12 1140 2004 0000 3702 9876 5432
						<IconCopy className="size-4 text-muted-foreground group-hover:text-primary" />
					</p>
				</div>
				<div className="row py-2 flex items-center justify-between">
					<span>Tytuł przelewu</span>
					<p className="group font-semibold text-base text-primary group flex items-center gap-1 cursor-pointer font-mono">
						WJN-7714
						<IconCopy className="size-4 text-muted-foreground group-hover:text-primary" />
					</p>
				</div>
				<div className="row py-2 flex items-center justify-between">
					<span>Kwota</span>
					<p className="text-black font-semibold text-lg font-mono">
						200.00 zł
					</p>
				</div>
				<div className="row py-2 flex items-center justify-between">
					<span>Termin płatności</span>
					<p className=" font-medium text-sm text-primary">
						do 23 lipca 2026
					</p>
				</div>
				<div className="row py-2 pb-0 flex gap-5 items-start justify-between">
					<span className="min-w-max">Dodatkowa informacja</span>
					<p className=" text-sm text-black text-right">
						Dodatkowa informacja o przelewu
					</p>
				</div>
			</div>
		</div>
	);
};

export default PaymentMethodTransfer;
