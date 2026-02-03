"use server";

import transporter from "@/lib/nodemailer";

interface Props {
	to: string;
	subject: string;
	user: {
		name: string;
	};
	meta: {
		header: string;
		icon: string;
		description: string;
		link: string;
	};
}

export async function sendEmailAction({ to, subject, meta, user }: Props) {
	const mailOptions = {
		from: '"StworzEvent.pl" <no-reply@stworzevent.pl>',
		to,
		subject,
		html: `
      <div
			style="
				background: #f5f5f5;
				padding: 12px;
				font-family: Arial, sans-serif;
				text-align: center;
				box-sizing: border-box;
				width: 100%;
				height: 100%;
			"
		>
			<table
				style="
					box-sizing: border-box;
					margin: 0 auto;
					max-width: 500px;
					background: white;
					border-radius: 30px;
					padding: 40px;
					width: 100%;
				"
			>
				<tr>
					<th>
						<img
							src="https://stworzevent.vercel.app/images/mails/logo_text_black.png"
							alt="logo"
							height="23"
							width="158"
							style="margin-bottom: 40px"
						/>
					</th>
				</tr>
				<tr>
					<td>
						<img
							src="${meta.icon}"
							alt="logo"
							height="100"
						/>
					</td>
				</tr>
				<tr>
					<td>
						<h1>${meta.header}</h1>
					</td>
				</tr>
				<tr>
					<td>
						<h2 style="margin-bottom: 20px">Witam, ${user.name}!</h2>
					</td>
				</tr>
				<tr>
					<td>
						<p
							style="
								line-height: 1.6em;
								color: gray;
								margin-top: 0;
								margin-bottom: 30px;
							"
						>
							${meta.description}
						</p>
					</td>
				</tr>
				<tr>
					<td align="center">
						<a
							onMouseOver="this.style.background='#fc8530'"
							onMouseOut="this.style.background='#f97316'"
							href="${meta.link}"
							style="
								text-decoration: none;
								color: white;
								font-weight: 600;
								display: block;
								padding: 0.8em 1em;
								background-color: #e86405;
								border-radius: 12px;
								max-width: fit-content;
							"
							>Potwierdzam adres e-mail</a
						>
					</td>
				</tr>
				<tr>
					<td style="padding-top: 30px">
						<span style="line-height: 1.6em; color: gray"
							>Z pozdrowieniami,<br />
							zespół StworzEvent.pl</span
						>
					</td>
				</tr>
			</table>

			<table
				border="0"
				cellpadding="0"
				cellspacing="0"
				width="100%"
				style="
					margin: 0 auto;
					margin-top: 20px;
					max-width: 500px;
					background: rgb(17, 17, 18);
					border-radius: 30px;
					padding: 40px;
				"
			>
				<tr>
					<td align="left" valign="middle">
						<img
							src="https://stworzevent.vercel.app/images/mails/logo_text_white.png"
							alt="logo"
							height="23"
							width="158"
						/>
					</td>
					<td align="right" valign="middle">
						<a
							href="https://www.facebook.com/groups/stworzevent/"
							target="_blank"
							><img
								src="https://stworzevent.vercel.app/images/mails/img-facebook.png"
								alt="logo"
								height="30"
								width="30"
						/></a>
					</td>
				</tr>
			</table>
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
