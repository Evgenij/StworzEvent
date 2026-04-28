import { useState, useRef, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import { searchCities } from "@/lib/nominatim";
import type { NominatimPlace } from "@/types/nominatim";

export function useCitySearch() {
	const [results, setResults] = useState<NominatimPlace[]>([]);
	const [loading, setLoading] = useState(false);
	const abortRef = useRef<AbortController | null>(null);

	const search = useDebouncedCallback(async (query: string) => {
		if (query.length < 2) {
			setResults([]);
			return;
		}

		abortRef.current?.abort();
		abortRef.current = new AbortController();
		setLoading(true);

		try {
			setResults(await searchCities(query));
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
