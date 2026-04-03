import { create } from "zustand";

type MobileMenuStore = {
	ticketDrawerOpen: boolean;
	openTicketDrawer: () => void;
	closeTicketDrawer: () => void;
};

export const useMobileMenuStore = create<MobileMenuStore>((set) => ({
	ticketDrawerOpen: false,
	openTicketDrawer: () => set({ ticketDrawerOpen: true }),
	closeTicketDrawer: () => set({ ticketDrawerOpen: false }),
}));
