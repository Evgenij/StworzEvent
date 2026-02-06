import { cn } from "@/lib/utils";
import styles from "./styles.module.scss";

// Типизация компонента: as может быть 'div', 'button', 'a' или другим компонентом
interface DynamicComponentProps {
	as?: React.ElementType;
	children: React.ReactNode;
}

export const Header: React.FC<DynamicComponentProps> = ({
	as: Component = "div",
	children,
}) => {
	const tagStyles = {
		h1: "text-4xl font-bold",
		h2: "text-3xl font-semibold",
		h3: "text-2xl font-semibold",
		div: "text-base",
	};

	// Компонент теперь динамически рендерит переданный тег
	return (
		<Component
			className={cn(
				styles.header,
				tagStyles[Component as keyof typeof tagStyles] || "",
			)}
		>
			{children}
		</Component>
	);
};
