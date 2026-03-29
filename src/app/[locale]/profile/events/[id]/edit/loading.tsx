import { Skeleton } from "@/components/shadcn/ui/skeleton";

export default function Loading() {
	return (
		<div className="flex flex-col gap-4">
			<Skeleton className="h-10 w-2/3" />
			<Skeleton className="h-10 w-1/2" />
			<Skeleton className="h-40 w-full" />
		</div>
	);
}
