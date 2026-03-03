import React from "react";

type FooterWebsiteProps = {
	locale: string;
};

const FooterWebsite = ({ locale }: FooterWebsiteProps) => {
	return (
		<footer className="border-t">
			<div className="container mx-auto px-5 h-16 flex items-center justify-between">
				FooterWebsite {locale}
			</div>
		</footer>
	);
};

export default FooterWebsite;
