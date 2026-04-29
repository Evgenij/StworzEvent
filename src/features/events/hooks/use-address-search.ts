import { useState, useRef, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import type { NominatimPlace } from "@/lib/nominatim/nominatim.types";
import { searchStreets } from "@/lib/nominatim/nominatim";

export function useAddressSearch(city: string) {
	const [results, setResults] = useState<NominatimPlace[]>([]);
	const [loading, setLoading] = useState(false);
	const abortRef = useRef<AbortController | null>(null);

	const search = useDebouncedCallback(async (query: string) => {
		if (query.length < 2 || !city) {
			setResults([]);
			return;
		}

		abortRef.current?.abort();
		abortRef.current = new AbortController();
		setLoading(true);

		try {
			setResults(await searchStreets(query, city));
		} finally {
			setLoading(false);
		}
	}, 500);

	const clear = useCallback(() => {
		abortRef.current?.abort();
		setResults([]);
	}, []);

	return { results, loading, search, clear };
}
