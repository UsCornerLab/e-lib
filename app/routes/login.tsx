import { GalleryVerticalEnd } from "lucide-react";
import React from "react";
import { Link } from "react-router";
import { LoginForm } from "~/components/auth/login-form";

export default function Login() {
	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex justify-center gap-2 md:justify-start">
					<Link to="/" className="flex items-center gap-2 font-medium">
						<div className="flex h-6 w-6 items-center justify-center rounded-md">
							<img src="/logo.svg" alt="logo" className="size-6" />
						</div>
						DDPL
					</Link>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-xs">
						<LoginForm />
					</div>
				</div>
			</div>
			<div className="relative hidden bg-muted lg:block">
				<div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary/40 z-10" />
				<img
					src="/background.jpg"
					alt="background"
					className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
				/>
			</div>
		</div>
	);
}
