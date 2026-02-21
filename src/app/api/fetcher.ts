export async function apiFetcher<T>(url: string): Promise<T> {
	console.log(`${process.env.NEXT_PUBLIC_API_URL}${url}`);
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api${url}`);

	const contentType = res.headers.get("content-type");

	if (!res.ok) {
		const body = contentType?.includes("application/json")
			? await res.json()
			: null;

		const error = new Error(body?.message || "Request failed");
		(error as any).code = body?.code;
		throw error;
	}

	return res.json();
}
