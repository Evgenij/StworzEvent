import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { IconArrowLeft } from "@tabler/icons-react";

interface ReturnBtnProps {
	href: string;
	label: string;
}

const ReturnBtn = ({ href, label }: ReturnBtnProps) => {
	return (
		<Button asChild variant={"outline"}>
			<Link href={href}>
				<IconArrowLeft />
				{label}
			</Link>
		</Button>
	);
};

export default ReturnBtn;
