import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */

const nextConfig = {
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		unoptimized: true,
	},
	serverExternalPackages: ["@node-rs/argon2"],
	transpilePackages: [
		"@tiptap/extension-bold",
		"@tiptap/core",
		"@tiptap/starter-kit",
	],

	// eslint: {
	// 	ignoreDuringBuilds: true,
	// },
	async headers() {
		return [
			{
				source: "/api/:path*",
				headers: [
					{ key: "Access-Control-Allow-Origin", value: "*" }, // или конкретный домен
					{
						key: "Access-Control-Allow-Methods",
						value: "GET,POST,PUT,DELETE,OPTIONS",
					},
					{
						key: "Access-Control-Allow-Headers",
						value: "Content-Type, Authorization",
					},
				],
			},
		];
	},
};

//export default nextConfig;
export default withNextIntl(nextConfig);
