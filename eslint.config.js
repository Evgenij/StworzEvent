import js from "@eslint/js";
import unusedImports from "eslint-plugin-unused-imports";

const sourceFiles = ["src/**/*.{js,jsx}"];

export default [
	{
		ignores: ["**/.next/**", "**/node_modules/**", "**/dist/**"],
	},
	{
		...js.configs.recommended,
		files: sourceFiles,
		languageOptions: {
			globals: {
				console: "readonly",
				window: "readonly",
				document: "readonly",
				navigator: "readonly",
				sessionStorage: "readonly",
				setTimeout: "readonly",
				FormData: "readonly",
			},
		},
		plugins: {
			"unused-imports": unusedImports,
		},
		rules: {
			"unused-imports/no-unused-imports": "error",
			"unused-imports/no-unused-vars": "warn",
		},
	},
];
