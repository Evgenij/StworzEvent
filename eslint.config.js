import js from "@eslint/js";

export default [
	js.configs.recommended,
	{
		ignores: [
			"**/*.ts",
			"**/*.tsx",
			".next/**",
			"node_modules/**",
			"dist/**",
		],
	},
];
