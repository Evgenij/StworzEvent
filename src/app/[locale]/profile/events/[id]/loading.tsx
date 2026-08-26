import { cn } from "@/lib/utils";

const Loading = ({ className }: { className?: string }) => {
	return (
		<div className={cn("loading text-blue-600 font-medium", className)}>
			loading...
		</div>
	);
};

export default Loading;
