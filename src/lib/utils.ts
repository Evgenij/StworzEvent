import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const normalizeName = (name: string): string => {
	return (
		name
			.trim()
			// 1. Удаляем ВСЁ, кроме латинских букв, пробелов и дефисов (убрали 0-9)
			.replace(/[^a-zA-Z\s'-]/g, "")
			// 2. Схлопываем двойные пробелы в один
			.replace(/\s+/g, " ")
			// 3. Делаем первую букву каждого слова заглавной, а остальные — строчными
			.replace(
				/\b\w+/g,
				(word) =>
					word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
			)
	);
};
