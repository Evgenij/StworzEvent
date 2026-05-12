import { cn } from "@/lib/utils";
import { Typography } from "@/shared/components";
import { IconWallet } from "@tabler/icons-react";

const PaymentMethodCash = ({ className }: { className?: string }) => {
	return (
		<div
			className={cn("payment-method-cash flex flex-col gap-2", className)}
		>
			<div className="payment-method-external-link__title flex gap-1 items-center pl-2">
				<IconWallet className="size-5 text-primary" />
				<Typography variant="h4">Oplata przy wejściu</Typography>
			</div>
			<div className="payment-method-external-link__content grid grid-cols-1 p-2 border border-primary/20 bg-primary/5 rounded-lg divide-y divide-primary/30 text-muted-foreground text-xs">
				<div className="row py-2 pt-0 flex items-center justify-between">
					<span>Kwota</span>
					<p className="text-black font-semibold text-lg font-mono">
						200.00 zł
					</p>
				</div>
				<div className="row py-2 pb-0 flex gap-5 items-start justify-between">
					<span className="min-w-max">Dodatkowa informacja</span>
					<p className=" text-sm text-black text-right">
						hjfj fhgf hfgjfgjgj fghgfh fghgfjfgj fgjgfhdfh gfjfhgfh
						ffghfghfg fghfghfgh hgfh fgh gh gfhhgfhfghfgh gfhgfh
						fjfgj fgjgfhdfh gfjfhgfh ffghfghfg fghfghfgh hgfh fgh gh
						gfhhgfhfghfgh gfhgfh
					</p>
				</div>
			</div>
		</div>
	);
};

export default PaymentMethodCash;
