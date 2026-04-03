"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import animationData from "../../../public/animations/page-loading.json";

type Props = {
	loop?: boolean;
	autoplay?: boolean;
	className?: string;
};

export function LottieAnimation({
	loop = true,
	autoplay = true,
	className,
}: Props) {
	return (
		<DotLottieReact
			data={animationData as never}
			loop={loop}
			autoplay={autoplay}
			className={className}
		/>
	);
}
