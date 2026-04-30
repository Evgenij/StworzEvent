export function normalizeIban(input: string): string {
	return input.replace(/\s+/g, "").toUpperCase();
}

export function isValidPolishIban(raw: string): boolean {
	const v = normalizeIban(raw);
	const candidate = /^\d{26}$/.test(v) ? `PL${v}` : v;
	if (!/^PL\d{26}$/.test(candidate)) return false;
	return mod97(candidate) === 1;
}

function mod97(iban: string): number {
	const rearranged = iban.slice(4) + iban.slice(0, 4);
	const numeric = rearranged
		.split("")
		.map((c) => (/[A-Z]/.test(c) ? (c.charCodeAt(0) - 55).toString() : c))
		.join("");
	// chunk processing to avoid Number.MAX_SAFE_INTEGER overflow
	let remainder = 0;
	for (let i = 0; i < numeric.length; i += 7) {
		const chunk = remainder.toString() + numeric.slice(i, i + 7);
		remainder = Number(chunk) % 97;
	}
	return remainder;
}

export function formatIban(raw: string): string {
	const v = normalizeIban(raw);
	return v.replace(/(.{4})/g, "$1 ").trim();
}
