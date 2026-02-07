import { cn } from "@/lib/utils";
import styles from "./styles.module.scss";

// Типизация компонента: as может быть 'div', 'button', 'a' или другим компонентом
interface DynamicComponentProps {
	as?: "h1" | "h2" | "h3" | "div";
	children: React.ReactNode;
	className?: string;
}

export const Header: React.FC<DynamicComponentProps> = ({
	as = "div",
	children,
	className,
}) => {
	const Component = as;
	const tagStyles = {
		h1: "text-4xl font-bold",
		h2: "text-3xl font-semibold",
		h3: "text-2xl font-semibold",
		div: "text-base",
	};

	// Компонент теперь динамически рендерит переданный тег
	return (
		<Component
			className={cn(styles.header, tagStyles[as] || "", className)}
		>
			{children}
		</Component>
	);
};
