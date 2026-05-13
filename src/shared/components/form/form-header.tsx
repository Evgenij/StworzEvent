import { TablerIcon } from "@tabler/icons-react";
import Typography from "../typography/typography";

const FormHeader = ({
	title,
	description,
	icon: Icon,
}: {
	title: string;
	description?: string;
	icon: TablerIcon;
}) => {
	return (
		<header className="flex items-start gap-4">
			<div className="rounded-lg bg-muted p-2.5 mt-0.5 shrink-0">
				<Icon className="size-5 text-muted-foreground" />
			</div>
			<div>
				<Typography variant="h2">{title}</Typography>
				{description && (
					<p className="text-sm text-muted-foreground mt-1">
						{description}
					</p>
				)}
			</div>
		</header>
	);
};

export default FormHeader;
