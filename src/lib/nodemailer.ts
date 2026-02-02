import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: "mail.stworzevent.pl",
	port: 465,
	secure: true,
	auth: {
		user: "contact@stworzevent.pl",
		pass: "Fp-D)VCFO-gZ2xC6",
	},
	tls: {
		rejectUnauthorized: false, // иногда нужно на shared-хостинге
	},
});

export default transporter;
