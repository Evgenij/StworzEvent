// src/components/dashboard/events/create-event-context.tsx
"use client";

import { createContext, useContext, useState } from "react";
import { type CreateEventInput } from "@/schemas/create-event.schema";
import { EventItemData } from "@/components/events/event-item";
import { type CategoryOption } from "@/actions/events/get-categories.action";

type CreateEventContextType = {
	preview: Partial<CreateEventInput>;
	setPreview: (data: Partial<CreateEventInput>) => void;
	previewAsEventItem: EventItemData | null;
	selectedCategory: CategoryOption | null;
	setSelectedCategory: (category: CategoryOption | null) => void;
};

const CreateEventContext = createContext<CreateEventContextType | null>(null);

export function CreateEventProvider({
	children,
	initialPreview = {},
}: {
	children: React.ReactNode;
	initialPreview?: Partial<CreateEventInput>;
}) {
	const [preview, setPreview] = useState<Partial<CreateEventInput>>(initialPreview);
	const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null);
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
			value={{ preview, setPreview, previewAsEventItem, selectedCategory, setSelectedCategory }}
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
