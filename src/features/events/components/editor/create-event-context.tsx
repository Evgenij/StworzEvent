// src/components/dashboard/events/create-event-context.tsx
"use client";

import { createContext, useContext, useState } from "react";
import { CreateEventInput } from "../../schemas/create-event.schema";
import { EventItemData } from "../catalog/event-item";
import { CategoryOption } from "../../actions/get-categories.action";

type CreateEventContextType = {
	preview: Partial<CreateEventInput>;
	setPreview: (data: Partial<CreateEventInput>) => void;
	previewAsEventItem: EventItemData | null;
	selectedCategory: CategoryOption | null;
	setSelectedCategory: (category: CategoryOption | null) => void;
	minPrice: number | null;
	setMinPrice: (price: number | null) => void;
};

const CreateEventContext = createContext<CreateEventContextType | null>(null);

export function CreateEventProvider({
	children,
	initialPreview = {},
	initialMinPrice = null,
}: {
	children: React.ReactNode;
	initialPreview?: Partial<CreateEventInput>;
	initialMinPrice?: number | null;
}) {
	const [preview, setPreview] =
		useState<Partial<CreateEventInput>>(initialPreview);
	const [selectedCategory, setSelectedCategory] =
		useState<CategoryOption | null>(null);
	const [minPrice, setMinPrice] = useState<number | null>(initialMinPrice);
	const previewAsEventItem: EventItemData | null = preview.title
		? {
				coverImage: preview.coverImage || null,
				title: preview.title,
				startsAt: preview.startsAt
					? new Date(preview.startsAt)
					: new Date(),
				location: preview.location || null,
				street: preview.street || null,
				streetNumber: preview.streetNumber || null,
			}
		: null;

	return (
		<CreateEventContext.Provider
			value={{
				preview,
				setPreview,
				previewAsEventItem,
				selectedCategory,
				setSelectedCategory,
				minPrice,
				setMinPrice,
			}}
		>
			{children}
		</CreateEventContext.Provider>
	);
}

export function useCreateEventPreview() {
	const ctx = useContext(CreateEventContext);
	if (!ctx)
		throw new Error(
			"useCreateEventPreview must be used within CreateEventProvider",
		);
	return ctx;
}
