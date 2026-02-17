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

	// eslint: {
	// 	ignoreDuringBuilds: true,
	// },
};

//export default nextConfig;
export default withNextIntl(nextConfig);
