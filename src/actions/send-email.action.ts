"use server";

import transporter from "@/lib/nodemailer";

interface Props {
	to: string;
	subject: string;
	meta: {
		description: string;
		link: string;
	};
}

const styles = {
	background: "red",
};

export async function sendEmailAction({ to, subject, meta }: Props) {
	const mailOptions = {
		from: '"StworzEvent" <no-reply@stworzevent.pl>',
		to,
		subject,
		html: `
      <div style="background: red; padding: 20px;">
        <h1>${subject}</h1>
        <p>${meta.description}</p>
        <a href="${meta.link}">Click here</a>
      </div>
    `,
	};

	try {
		await transporter.sendMail(mailOptions);

		return { success: true };
	} catch (error) {
		console.error("Error sending email:", error);

		return { success: false, error: "Failed to send email" };
	}
}
