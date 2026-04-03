type IconProps = {
	className?: string;
	size?: number;
	stroke?: string;
	strokeWidth?: number | string;
};

export function IconMyNew({
	className,
	size = 24,
	stroke = "currentColor",
	strokeWidth = 2,
}: IconProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			{/* Вставь свои path сюда */}
			<path
				stroke={stroke}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
