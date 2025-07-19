import { Clock } from "lucide-react";
import { Link, Outlet } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function Layout() {
	return (
		<div className="flex flex-col min-h-screen">
			<header className="sticky top-0 z-50 w-full border-b bg-background/95 px-10 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container flex h-16 items-center justify-between">
					<Link to="/" className="flex items-center gap-2 font-medium">
						<div className="flex h-6 w-6 items-center justify-center rounded-md">
							<img src="/logo.svg" alt="logo" className="size-6" />
						</div>
						DDPL
					</Link>
					<nav className="hidden md:flex items-center gap-6">
						<Link to="/" className="text-sm font-medium hover:text-primary">
							Home
						</Link>
						<Link
							to="/#services"
							className="text-sm font-medium hover:text-primary"
						>
							Services
						</Link>
						<Link
							to="/catalog"
							className="text-sm font-medium hover:text-primary"
						>
							Catalog
						</Link>
						<Link
							to="/#contact"
							className="text-sm font-medium hover:text-primary"
						>
							Contact
						</Link>
					</nav>
					<div className="flex items-center gap-4">
						<span className="hidden md:inline-flex text-sm text-muted-foreground">
							<Clock className="mr-2 h-4 w-4" /> Mon-Sat: 9:00am - 8:00pm
						</span>
						<Button variant="outline" size="sm" asChild>
							<Link to="/login">Login</Link>
						</Button>
						<Button size="sm" asChild>
							<Link to="/sign-up">Join the Library</Link>
						</Button>
					</div>
				</div>
			</header>
			<Outlet />
			<footer className="bg-muted py-12 px-12">
				<div className="container">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div>
							<Link to="/" className="flex my-6 items-center gap-2 font-medium">
								<div className="flex h-6 w-6 items-center justify-center rounded-md">
									<img src="/logo.svg" alt="logo" className="size-6" />
								</div>
								DDPL
							</Link>
							<p className="text-muted-foreground">
								Your community hub for knowledge, resources, and events.
							</p>
						</div>
						<div>
							<h3 className="font-semibold mb-4">Quick Links</h3>
							<ul className="space-y-2">
								<li>
									<Link
										to="/"
										className="text-muted-foreground hover:text-foreground"
									>
										Home
									</Link>
								</li>
								<li>
									<Link
										to="/about"
										className="text-muted-foreground hover:text-foreground"
									>
										About Us
									</Link>
								</li>
								<li>
									<Link
										to="/catalog"
										className="text-muted-foreground hover:text-foreground"
									>
										Catalog
									</Link>
								</li>
								<li>
									<Link
										to="/events"
										className="text-muted-foreground hover:text-foreground"
									>
										Events
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold mb-4">Services</h3>
							<ul className="space-y-2">
								<li>
									<Link
										to="/services/borrowing"
										className="text-muted-foreground hover:text-foreground"
									>
										Book Borrowing
									</Link>
								</li>
								<li>
									<Link
										to="/services/programs"
										className="text-muted-foreground hover:text-foreground"
									>
										Community Programs
									</Link>
								</li>
								<li>
									<Link
										to="/services/spaces"
										className="text-muted-foreground hover:text-foreground"
									>
										Study Spaces
									</Link>
								</li>
								<li>
									<Link
										to="/services/digital"
										className="text-muted-foreground hover:text-foreground"
									>
										Digital Resources
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold mb-4">Connect With Us</h3>
							<div className="flex space-x-4 mb-4">
								<Link
									to="#"
									className="text-muted-foreground hover:text-foreground"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="lucide lucide-facebook"
									>
										<title>Facebook</title>
										<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
									</svg>
									<span className="sr-only">Facebook</span>
								</Link>
								<Link
									to="#"
									className="text-muted-foreground hover:text-foreground"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="lucide lucide-twitter"
									>
										<title>Twitter</title>
										<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
									</svg>
									<span className="sr-only">Twitter</span>
								</Link>
								<Link
									to="#"
									className="text-muted-foreground hover:text-foreground"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="lucide lucide-instagram"
									>
										<title>Instagram</title>
										<rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
										<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
										<line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
									</svg>
									<span className="sr-only">Instagram</span>
								</Link>
							</div>
							<div>
								<h4 className="font-medium mb-2">
									Subscribe to our newsletter
								</h4>
								<div className="flex gap-2">
									<Input
										type="email"
										placeholder="Your email"
										className="max-w-[200px]"
									/>
									<Button size="sm">Subscribe</Button>
								</div>
							</div>
						</div>
					</div>
					<div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
						<p>© {new Date().getFullYear()} DDPL. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
