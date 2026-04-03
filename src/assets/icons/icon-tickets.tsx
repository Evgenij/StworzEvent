import React from "react";

type IconProps = {
	className?: string;
	size?: number;
	stroke?: string;
	strokeWidth?: number;
};

const IconTickets = ({
	className,
	size = 24,
	stroke = "currentColor",
	strokeWidth = 2,
}: IconProps) => {
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	></svg>;

	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<path
				d="M13.5 4V6M13.5 10V12M13.5 16V18M3.5 4H17.5C18.0304 4 18.5391 4.21071 18.9142 4.58579C19.2893 4.96086 19.5 5.46957 19.5 6V9C18.9696 9 18.4609 9.21071 18.0858 9.58579C17.7107 9.96086 17.5 10.4696 17.5 11C17.5 11.5304 17.7107 12.0391 18.0858 12.4142C18.4609 12.7893 18.9696 13 19.5 13V16C19.5 16.5304 19.2893 17.0391 18.9142 17.4142C18.5391 17.7893 18.0304 18 17.5 18H3.5C2.96957 18 2.46086 17.7893 2.08579 17.4142C1.71071 17.0391 1.5 16.5304 1.5 16V13C2.03043 13 2.53914 12.7893 2.91421 12.4142C3.28929 12.0391 3.5 11.5304 3.5 11C3.5 10.4696 3.28929 9.96086 2.91421 9.58579C2.53914 9.21071 2.03043 9 1.5 9V6C1.5 5.46957 1.71071 4.96086 2.08579 4.58579C2.46086 4.21071 2.96957 4 3.5 4Z"
				stroke={stroke}
				stroke-width={strokeWidth}
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M21.3284 7.58594C21.7035 7.96101 21.9142 8.46972 21.9142 9.00015V12.0002C21.3838 12.0002 20.8751 12.2109 20.5 12.5859C20.1249 12.961 19.9142 13.4697 19.9142 14.0002C19.9142 14.5306 20.1249 15.0393 20.5 15.4144C20.8751 15.7894 21.3838 16.0002 21.9142 16.0002V19.0002C21.9142 19.5306 21.7035 20.0393 21.3284 20.4144C20.9534 20.7894 20.4446 21.0002 19.9142 21.0002H5.91421C5.38378 21.0002 4.87507 20.7894 4.5 20.4144"
				stroke={stroke}
				stroke-width={strokeWidth}
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	);
};

export default IconTickets;
