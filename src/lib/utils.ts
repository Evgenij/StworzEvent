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

export const getBaseUrl = () => {
	if (typeof window !== "undefined") return ""; // в браузере используем относительный путь
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // для Vercel
	return `http://localhost:3000`; // для локалки
};

export const truncate = (str: string, length: number) =>
	str.length > length ? `${str.slice(0, length)}...` : str;

export const formatPlnFromGrosze = (amount: number) =>
	`${(amount / 100).toFixed(2)} zł`;
