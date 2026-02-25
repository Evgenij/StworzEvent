"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
	IconAlertTriangleFilled,
	IconCircleCheckFilled,
	IconExclamationCircleFilled,
	IconInfoCircleFilled,
	IconLoader,
} from "@tabler/icons-react";

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			position="top-center"
			closeButton
			expand={false}
			duration={3000}
			icons={{
				success: (
					<IconCircleCheckFilled className="size-5 text-green-600" />
				),
				info: <IconInfoCircleFilled className="size-5 text-blue-500" />,
				warning: (
					<IconAlertTriangleFilled className="size-5 text-orange-500" />
				),
				error: (
					<IconExclamationCircleFilled className="size-5 text-red-500" />
				),
				loading: <IconLoader className="size-5 animate-spin " />,
			}}
			style={
				{
					padding: "40px",
					"--normal-bg": "var(--popover)",
					"--normal-text": "var(--popover-foreground)",
					"--normal-border": "var(--border)",
					"--border-radius": "var(--radius)",
				} as React.CSSProperties
			}
			toastOptions={{
				classNames: {
					toast: "cn-toast",
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
