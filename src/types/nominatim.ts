export interface NominatimPlace {
	place_id: number;
	display_name: string;
	name: string;
	lat: string;
	lon: string;
	address: {
		city?: string;
		town?: string;
		village?: string;
		municipality?: string;
		road?: string;
		house_number?: string;
		postcode?: string;
		country_code?: string;
		// административные единицы Польши
		state?: string; // województwo приходит сюда
		county?: string; // powiat
		suburb?: string;
		neighbourhood?: string;
		quarter?: string;
	};
	class: string;
	type: string;
	addresstype: string;
}

export interface LocationValue {
	city: string;
	street: string;
	streetNumber: string;
	lat: number;
	lng: number;
}
