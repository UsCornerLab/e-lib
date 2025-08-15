import { Skeleton } from "~/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "~/components/ui/card";

interface BookSkeletonProps {
	count?: number;
}

export function BookSkeleton({ count = 8 }: BookSkeletonProps) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
			{Array.from({ length: count }).map((c) => (
				<Card key={c as string} className="overflow-hidden">
					<Skeleton className="h-[240px] w-full" />
					<CardContent className="pt-4">
						<Skeleton className="h-6 w-3/4 mb-2" />
						<Skeleton className="h-4 w-1/2 mb-2" />
						<Skeleton className="h-4 w-1/4 mb-4" />
						<Skeleton className="h-4 w-full mb-1" />
						<Skeleton className="h-4 w-full mb-1" />
						<Skeleton className="h-4 w-2/3" />
					</CardContent>
					<CardFooter>
						<Skeleton className="h-9 w-full" />
					</CardFooter>
				</Card>
			))}
		</div>
	);
}
