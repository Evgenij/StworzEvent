import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: "mail.stworzevent.pl",
	port: 465,
	secure: true,
	auth: {
		user: process.env.MAIL_NAME,
		pass: process.env.MAIL_PASSWORD,
	},
	tls: {
		rejectUnauthorized: false, // иногда нужно на shared-хостинге
	},
});

export default transporter;
