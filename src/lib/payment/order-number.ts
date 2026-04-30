/** Format: STW-{YY}{MM}-{6 alphanum} → e.g. STW-2604-A8F3K9 */
export function generateOrderNumber(date: Date = new Date()): string {
	const yy = String(date.getFullYear()).slice(-2);
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/0/1
	let suffix = "";
	for (let i = 0; i < 6; i++) {
		suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
	}
	return `STW-${yy}${mm}-${suffix}`;
}
