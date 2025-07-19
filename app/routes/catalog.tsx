import React, { Suspense } from "react";
import { BookCatalog } from "~/components/book-catalog/book-catalog";
import { BookSkeleton } from "~/components/book-catalog/booking-skeleton";
import { CatalogSearch } from "~/components/book-catalog/catalog-search";

export default function Book() {
	return (
		<div className="min-h-screen bg-background px-12">
			<div className="container py-8 md:py-12">
				<div className="flex flex-col gap-6">
					<div>
						<h1 className="text-3xl md:text-4xl font-bold mb-2">
							Library Catalog
						</h1>
						<p className="text-muted-foreground">
							Browse our collection of books, e-books, audiobooks, and more.
						</p>
					</div>

					<CatalogSearch />

					<Suspense fallback={<BookSkeleton count={12} />}>
						<BookCatalog />
					</Suspense>
				</div>
			</div>
		</div>
	);
}
