"use client";

import { useSyncExternalStore } from "react";

let isOrdersLoading = false;
const listeners = new Set<() => void>();

export function setOrdersLoading(nextValue: boolean) {
	if (isOrdersLoading === nextValue) return;

	isOrdersLoading = nextValue;
	listeners.forEach((listener) => listener());
}

export function useOrdersLoading() {
	return useSyncExternalStore(
		(listener) => {
			listeners.add(listener);
			return () => listeners.delete(listener);
		},
		() => isOrdersLoading,
		() => false,
	);
}
