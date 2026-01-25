"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing"; // Важно: импорт из твоего файла routing!
import { useParams } from "next/navigation";
import { SelectValue } from "./ui/select";
// import {
// 	Select,
// 	SelectContent,
// 	SelectItem,
// 	SelectTrigger,
// 	SelectValue,
// } from "@/components/ui/select";

export default function LocaleSwitcher() {
	const locale = useLocale(); // Получаем текущий язык (pl или en)
	const router = useRouter();
	const pathname = usePathname();
	const params = useParams();

	function onLocaleChange(nextLocale: string) {
		// router.replace сохраняет текущий путь, но меняет префикс языка
		router.replace(
			// @ts-ignore - чтобы не ругался на типы путей
			{ pathname, params },
			{ locale: nextLocale },
		);
	}

	return (
		<SelectValue></SelectValue>
		// <Select defaultValue={locale} onValueChange={onLocaleChange}>
		// 	<SelectTrigger className="w-[120px] bg-background">
		// 		<SelectValue placeholder="Język" />
		// 	</SelectTrigger>
		// 	<SelectContent>
		// 		<SelectItem value="pl">Polski</SelectItem>
		// 		<SelectItem value="en">English</SelectItem>
		// 	</SelectContent>
		// </Select>
	);
}
