import { TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const NavigationItem = ({
	className,
	children,
	href,
	icon: Icon,
}: {
	className?: string;
	children: React.ReactNode;
	icon: React.ElementType;
	href: string;
}) => {
	return (
		<Link href={href}>
			<TabsTrigger
				value={href}
				className={cn("navigation-item ", className)}
			>
				{<Icon />}
				{children}
			</TabsTrigger>
		</Link>
	);
};

export default NavigationItem;
