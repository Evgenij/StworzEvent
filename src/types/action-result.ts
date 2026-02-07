export type ActionResult = {
	success: boolean;
	message?: string; // Общее сообщение (например, для Toast)
	errors?: Record<string, string[]>; // Ошибки полей (email: ["Неверный формат"])
};
