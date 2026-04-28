// src/hooks/use-countdown.ts
"use client";

import { useState, useEffect } from "react";

export const useCountdown = (expiresAt: Date) => {
	const getRemaining = () => {
		const diff = expiresAt.getTime() - Date.now();
		return Math.max(0, diff);
	};

	const [remaining, setRemaining] = useState(getRemaining);

	useEffect(() => {
		if (remaining === 0) return;

		const interval = setInterval(() => {
			const r = getRemaining();
			setRemaining(r);
			if (r === 0) clearInterval(interval);
		}, 1000);

		return () => clearInterval(interval);
	}, [expiresAt]);

	const minutes = Math.floor(remaining / 1000 / 60);
	const seconds = Math.floor((remaining / 1000) % 60);
	const isExpired = remaining === 0;

	const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

	return { formatted, isExpired, remaining };
};
