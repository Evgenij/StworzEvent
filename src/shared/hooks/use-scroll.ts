"use client";
import { useEffect, useState, RefObject } from "react";

export function useScroll(
	downThreshold: number,
	upThreshold?: number,
	container?: RefObject<HTMLElement | null> | string,
) {
	const [scrolled, setScrolled] = useState(false);
	const scrollUpThreshold = upThreshold ?? downThreshold / 2;

	useEffect(() => {
		const resolveTarget = (): HTMLElement | Window => {
			if (!container) return window;
			if (typeof container === "string")
				return document.querySelector<HTMLElement>(container) ?? window;
			return container.current ?? window;
		};

		const target = resolveTarget();

		const handleScroll = () => {
			const y = target instanceof Window ? target.scrollY : target.scrollTop;

			// Hysteresis: different thresholds for up/down to prevent flickering
			setScrolled((prev) => {
				if (prev) return y > scrollUpThreshold;
				return y > downThreshold;
			});
		};

		target.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll();
		return () => target.removeEventListener("scroll", handleScroll);
	}, [downThreshold, scrollUpThreshold, container]);

	return scrolled;
}
