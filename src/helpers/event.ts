export function getMinTicketPrice(tickets: { price: number }[]): number | null {
	if (!tickets.length) return null;
	return Math.min(...tickets.map((t) => t.price));
}
