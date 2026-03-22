// src/components/dashboard/events/create-event-context.tsx
"use client";

import { createContext, useContext, useState } from "react";
import { type CreateEventInput } from "@/schemas/create-event.schema";

type CreateEventContextType = {
	preview: Partial<CreateEventInput>;
	setPreview: (data: Partial<CreateEventInput>) => void;
};

const CreateEventContext = createContext<CreateEventContextType | null>(null);

export function CreateEventProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [preview, setPreview] = useState<Partial<CreateEventInput>>({});

	return (
		<CreateEventContext.Provider value={{ preview, setPreview }}>
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
