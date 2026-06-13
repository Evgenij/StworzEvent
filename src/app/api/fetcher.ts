type ParamValue = string | number | boolean | string[] | undefined;

type FetcherOptions = {
	method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	params?: Record<string, ParamValue>;
	body?: unknown;
	headers?: HeadersInit;
};

export async function apiFetcher<T>(
	url: string,
	options?: FetcherOptions,
): Promise<T> {
	const { method = "GET", params, body, headers } = options || {};

	const query = params
		? (() => {
				const p = new URLSearchParams();
				for (const [k, v] of Object.entries(params)) {
					if (v === undefined) continue;
					if (Array.isArray(v)) {
						v.forEach((item) => p.append(k, item));
					} else {
						p.set(k, String(v));
					}
				}
				return `?${p.toString()}`;
			})()
		: "";

	//const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}/api${url}${query}`;
	const fullUrl = `/api${url}${query}`;

	const res = await fetch(fullUrl, {
		method,
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
		body: body ? JSON.stringify(body) : undefined,
	});

	const contentType = res.headers.get("content-type");

	if (!res.ok) {
		const responseBody = contentType?.includes("application/json")
			? await res.json()
			: null;

		const error = new Error(responseBody?.message || "Request failed");
		(error as any).code = responseBody?.code;
		throw error;
	}

	return res.json();
}

// export async function apiFetcher<T>(url: string): Promise<T> {
// 	console.log(`${process.env.NEXT_PUBLIC_API_URL}${url}`);
// 	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api${url}`);

// 	const contentType = res.headers.get("content-type");

// 	if (!res.ok) {
// 		const body = contentType?.includes("application/json")
// 			? await res.json()
// 			: null;

// 		const error = new Error(body?.message || "Request failed");
// 		(error as any).code = body?.code;
// 		throw error;
// 	}

// 	return res.json();
// }
