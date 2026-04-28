// components/ui/event-image-placeholder.tsx

export function EventImagePlaceholder() {
	return (
		<div className="relative w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center aspect-video">
			<svg
				viewBox="0 0 400 225"
				xmlns="http://www.w3.org/2000/svg"
				className="w-full h-full"
				aria-hidden="true"
			>
				{/* Background */}
				<rect width="400" height="225" fill="#F3F4F6" />

				{/* Subtle grid pattern */}
				<pattern
					id="grid"
					width="20"
					height="20"
					patternUnits="userSpaceOnUse"
				>
					<path
						d="M 20 0 L 0 0 0 20"
						fill="none"
						stroke="#E5E7EB"
						strokeWidth="0.5"
					/>
				</pattern>
				<rect width="400" height="225" fill="url(#grid)" />

				{/* Calendar icon */}
				<g transform="translate(160, 70)">
					{/* Icon body */}
					<rect
						x="0"
						y="10"
						width="80"
						height="72"
						rx="6"
						fill="#E5E7EB"
					/>
					{/* Header strip */}
					<rect
						x="0"
						y="10"
						width="80"
						height="22"
						rx="6"
						fill="#D1D5DB"
					/>
					<rect x="0" y="24" width="80" height="8" fill="#D1D5DB" />
					{/* Hooks */}
					<rect
						x="22"
						y="4"
						width="8"
						height="16"
						rx="4"
						fill="#9CA3AF"
					/>
					<rect
						x="50"
						y="4"
						width="8"
						height="16"
						rx="4"
						fill="#9CA3AF"
					/>
					{/* Grid dots */}
					<circle cx="22" cy="54" r="4" fill="#9CA3AF" />
					<circle cx="40" cy="54" r="4" fill="#9CA3AF" />
					<circle cx="58" cy="54" r="4" fill="#9CA3AF" />
					<circle cx="22" cy="70" r="4" fill="#9CA3AF" />
					<circle cx="40" cy="70" r="4" fill="#9CA3AF" />
					<circle cx="58" cy="70" r="4" fill="#C9CACC" />
				</g>

				{/* Label */}
				<text
					x="200"
					y="178"
					textAnchor="middle"
					fontFamily="system-ui, sans-serif"
					fontSize="13"
					fill="#9CA3AF"
					letterSpacing="0.5"
				>
					Brak zdjęcia
				</text>
			</svg>
		</div>
	);
}
