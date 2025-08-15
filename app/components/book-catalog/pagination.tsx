"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "~/components/ui/button";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
	const router = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	// Generate page numbers to display
	const generatePagination = () => {
		// If 7 or fewer pages, show all
		if (totalPages <= 7) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		// Always include first and last page
		const firstPage = 1;
		const lastPage = totalPages;

		// For current page near the beginning
		if (currentPage <= 3) {
			return [1, 2, 3, 4, 5, "ellipsis", totalPages];
		}

		// For current page near the end
		if (currentPage >= totalPages - 2) {
			return [
				1,
				"ellipsis",
				totalPages - 4,
				totalPages - 3,
				totalPages - 2,
				totalPages - 1,
				totalPages,
			];
		}

		// For current page in the middle
		return [
			1,
			"ellipsis",
			currentPage - 1,
			currentPage,
			currentPage + 1,
			"ellipsis",
			totalPages,
		];
	};

	const pagination = generatePagination();

	return (
		<div className="flex justify-center items-center space-x-2 mt-8">
			<Button
				variant="outline"
				size="icon"
				disabled={currentPage <= 1}
				onClick={() =>
					setSearchParams((searchParams) => {
						searchParams.set("page", (currentPage - 1).toString());
						return searchParams;
					})
				}
			>
				<ChevronLeft className="h-4 w-4" />
				<span className="sr-only">Previous page</span>
			</Button>

			{pagination.map((page, index) => {
				if (page === "ellipsis") {
					return (
						<Button
							key={`ellipsis-${page}`}
							variant="ghost"
							size="icon"
							disabled
						>
							<MoreHorizontal className="h-4 w-4" />
							<span className="sr-only">More pages</span>
						</Button>
					);
				}

				return (
					<Button
						key={`page-${page}`}
						variant={currentPage === page ? "default" : "outline"}
						size="icon"
						onClick={() =>
							setSearchParams((searchParams) => {
								searchParams.set("page", page.toString());
								return searchParams;
							})
						}
					>
						{page}
						<span className="sr-only">Page {page}</span>
					</Button>
				);
			})}

			<Button
				variant="outline"
				size="icon"
				disabled={currentPage >= totalPages}
				onClick={() =>
					setSearchParams((searchParams) => {
						searchParams.set("page", (currentPage + 1).toString());
						return searchParams;
					})
				}
			>
				<ChevronRight className="h-4 w-4" />
				<span className="sr-only">Next page</span>
			</Button>
		</div>
	);
}
