import js from "@eslint/js";
import unusedImports from "eslint-plugin-unused-imports";

export default [
	js.configs.recommended,
	{
		// ignores: [
		// 	"**/*.ts",
		// 	"**/*.tsx",
		// 	".next/**",
		// 	"node_modules/**",
		// 	"dist/**",
		// ],
		ignores: [".next/**", "node_modules/**", "dist/**"],
		plugins: {
			"unused-imports": unusedImports,
		},
		rules: {
			"unused-imports/no-unused-imports": "error",
			"unused-imports/no-unused-vars": "warn",
		},
	},
];
