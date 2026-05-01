export type OrderPaymentInstructionsMailProps = {
	buyerName: string;
	eventTitle: string;
	orderNumber: string;
	paymentMethod: "BANK_TRANSFER" | "EXTERNAL_LINK" | "CASH_AT_ENTRANCE" | null;
	bankAccount?: string | null;
	bankHolder?: string | null;
	paymentLink?: string | null;
	paymentInstructions?: string | null;
};

export const orderPaymentInstructionsMail = (
	data: OrderPaymentInstructionsMailProps,
): string => {
	const esc = (s: string) =>
		s
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");

	const formatIban = (raw: string) =>
		raw.replace(/\s+/g, "").toUpperCase().replace(/(.{4})/g, "$1 ").trim();

	let paymentBlock = "";

	if (data.paymentMethod === "BANK_TRANSFER") {
		paymentBlock = `
			<p style="margin:0 0 8px 0;font-size:15px;font-weight:bold;color:#000">Dane do przelewu:</p>
			${data.bankAccount ? `<p style="margin:0 0 4px 0;font-size:14px;color:#333">Numer konta: <strong>${esc(formatIban(data.bankAccount))}</strong></p>` : ""}
			${data.bankHolder ? `<p style="margin:0 0 4px 0;font-size:14px;color:#333">Odbiorca: <strong>${esc(data.bankHolder)}</strong></p>` : ""}
			<p style="margin:0 0 4px 0;font-size:14px;color:#333">Tytuł przelewu: <strong>${esc(data.orderNumber)}</strong></p>
			${data.paymentInstructions ? `<p style="margin:12px 0 0 0;font-size:14px;color:#555;white-space:pre-line">${esc(data.paymentInstructions)}</p>` : ""}
		`;
	} else if (data.paymentMethod === "EXTERNAL_LINK" && data.paymentLink) {
		paymentBlock = `
			${data.paymentInstructions ? `<p style="margin:0 0 12px 0;font-size:14px;color:#555;white-space:pre-line">${esc(data.paymentInstructions)}</p>` : ""}
			<a href="${esc(data.paymentLink)}" target="_blank" style="display:inline-block;padding:12px 20px;font-size:15px;font-weight:bold;color:#fff;background:#e86405;border-radius:12px;text-decoration:none">Przejdź do płatności</a>
		`;
	} else if (data.paymentMethod === "CASH_AT_ENTRANCE") {
		paymentBlock = `<p style="margin:0;font-size:14px;color:#333">Płatność gotówką przy wejściu na wydarzenie.</p>`;
	} else {
		paymentBlock = `<p style="margin:0;font-size:14px;color:#333">Skontaktuj się z organizatorem w celu ustalenia szczegółów płatności.</p>`;
	}

	return `
		<div style="background:#f5f5f5;padding:12px;font-family:Arial,sans-serif;text-align:center;box-sizing:border-box;width:100%">
			<table style="box-sizing:border-box;margin:0 auto;max-width:500px;background:white;border-radius:30px;padding:40px;width:100%;text-align:left">
				<tr>
					<th style="text-align:left">
						<img src="https://stworzevent.vercel.app/images/mails/logo_text_black.png" alt="logo" height="23" width="158" style="margin-bottom:32px" />
					</th>
				</tr>
				<tr>
					<td>
						<h1 style="margin:0 0 8px 0;font-size:24px;font-weight:bold;color:#000">Zamówienie złożone!</h1>
						<p style="margin:0 0 24px 0;font-size:15px;color:#555">Cześć ${esc(data.buyerName)}, dziękujemy za zakup biletów na <strong>${esc(data.eventTitle)}</strong>.</p>
					</td>
				</tr>
				<tr>
					<td>
						<table width="100%" style="background:#f3f3f3;border-radius:16px;padding:20px;margin-bottom:24px">
							<tr>
								<td>
									<p style="margin:0 0 4px 0;font-size:13px;color:#777">Numer zamówienia</p>
									<p style="margin:0;font-size:16px;font-weight:bold;font-family:monospace;color:#000">${esc(data.orderNumber)}</p>
								</td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td>
						<table width="100%" style="background:#f3f3f3;border-radius:16px;padding:20px;margin-bottom:24px">
							<tr><td>${paymentBlock}</td></tr>
						</table>
					</td>
				</tr>
				<tr>
					<td style="padding-top:20px">
						<span style="font-size:14px;color:#777">Z pozdrowieniami,<br/>zespół StworzEvent.pl</span>
					</td>
				</tr>
			</table>
		</div>
	`;
};

export type AuthMailsProps = {
	header: string;
	subheader: string;
	icon: string;
	description: string;
	link: string;
	btnText: string;
};

export type InvitationMailsProps = {
	header: string;
	subheader: string;
	ticket: {
		name: string;
		header: {
			main: string;
			subheader: string;
		};
		footer: string;
		btnText: string;
	};
	link: string;
};

export type CodeMailsProps = {
	header: string;
	subheader: string;
	ticket: {
		name: string;
		header: {
			main: string;
			subheader: string;
		};
		footer: string;
		btnText: string;
	};
	link: string;
};

export const authMail = (data: AuthMailsProps) => {
	return `
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
							src="${data.icon}"
							alt="logo"
							height="100"
						/>
					</td>
				</tr>
				<tr>
					<td>
						<h1 style="margin-top: 0">${data.header}</h1>
					</td>
				</tr>
				<tr>
					<td>
						<h2 style="margin-bottom: 20px">${data.subheader}</h2>
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
							${data.description}
						</p>
					</td>
				</tr>
				<tr>
					<td align="center">
						<a
							onMouseOver="this.style.background='#fc8530'"
							onMouseOut="this.style.background='#f97316'"
							href="${data.link}"
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
							>${data.btnText}</a
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
    `;
};

export const invitationMail = (data: InvitationMailsProps) => {
	return `<div
			style="
				background: #f5f5f5;
				font-family: Arial, sans-serif;
				text-align: center;
				box-sizing: border-box;
				width: 100%;
				height: 100%;
			"
		>
			<table
				role="presentation"
				border="0"
				cellspacing="0"
				cellpadding="0"
				style="
					background-color: #ffffff;
					max-width: 500px;
					margin: 0 auto;
					padding: 30px;
					height: 100%;
				"
			>
				<tbody>
					<tr>
						<td align="center" style="padding: 20px 0">
							<table
								role="presentation"
								border="0"
								cellspacing="0"
								cellpadding="0"
								style="
									width: 500px;
									margin: 0 auto;
									text-align: left;
								"
							>
								<tbody>
									<tr>
										<td
											style="
												padding: 0 0 20px 0;
												border-bottom: 1px solid #eeeeee;
												height: 30px;
											"
										>
											<img
												src="https://stworzevent.vercel.app/images/mails/logo_text_black.png"
												alt="StworzEvent.pl"
												width="180"
												style="
													display: block;
													border: 0;
												"
											/>
										</td>
									</tr>

									<tr>
										<td style="padding: 32px 0 16px 0">
											<h1
												style="
													margin: 0;
													font-size: 28px;
													font-weight: bold;
													color: #000000;
												"
											>
												${data.header}
											</h1>
										</td>
									</tr>

									<tr>
										<td style="padding: 0 0 30px 0">
											<p
												style="
													margin: 0;
													font-size: 16px;
													line-height: 1.4;
													color: #000000;
													font-weight: 500;
												"
											>
												${data.subheader}
											</p>
										</td>
									</tr>

									<tr>
										<td>
											<table
												role="presentation"
												width="100%"
												border="0"
												cellspacing="0"
												cellpadding="0"
												style="
													background-color: #e9e9e9;
													border-radius: 16px;
													overflow: hidden;
												"
											>
												<tbody>
													<tr>
														<td
															style="
																background-color: #000000;
																padding: 16px
																	20px;
															"
														>
															<p
																style="
																	margin: 0;
																	color: #ffffff;
																	font-size: 16px;
																	font-weight: bold;
																"
															>
																${data.ticket.name} –
																<span
																	style="
																		color: #ff7a1a;
																	"
																	>Beta
																	test</span
																>
															</p>
														</td>
													</tr>
													<tr>
														<td
															style="
																padding: 20px;
																background-color: rgb(
																	243,
																	243,
																	243
																);
															"
														>
															<p
																style="
																	margin: 0 0
																		15px 0;
																	font-size: 16px;
																	font-weight: bold;
																	color: #000000;
																"
															>
																Oficjalnie
																ruszamy z etapem
																zamkniętych
																testów beta
																StworzEvent.pl.
															</p>
															<p
																style="
																	margin: 0;
																	font-size: 16px;
																	color: #000000;
																"
															>
																Twoje konto jest
																już gotowe do
																działania.
															</p>
														</td>
													</tr>
													<tr>
														<td
															style="
																border-bottom: 2px
																	dashed #fff;
																font-size: 0;
																line-height: 0;
															"
														>
															&nbsp;
														</td>
													</tr>
													<tr>
														<td
															style="
																padding: 20px;
																background-color: rgb(
																	243,
																	243,
																	243
																);
															"
														>
															<p
																style="
																	margin: 0 0
																		20px 0;
																	font-size: 15px;
																	color: #000000;
																"
															>
																Pozostał ostatni
																krok —
																potwierdzenie
																konta i
																ustawienie hasła
																dostępu.
															</p>
															<table
																role="presentation"
																border="0"
																cellspacing="0"
																cellpadding="0"
															>
																<tbody>
																	<tr>
																		<td
																			align="center"
																			bgcolor="#ff7a1a"
																			style="
																				border-radius: 12px;
																			"
																		>
																			<a
																				href="${data.link}"
																				target="_blank"
																				style="
																					display: inline-block;
																					padding: 12px
																						20px;
																					font-size: 16px;
																					font-weight: bold;
																					color: #ffffff;
																					text-decoration: none;
																				"
																				>Wejdź
																				do
																				platformy</a
																			>
																		</td>
																	</tr>
																</tbody>
															</table>
														</td>
													</tr>
												</tbody>
											</table>
										</td>
									</tr>

									<tr>
										<td style="padding: 24px 0 20px 0">
											<p
												style="
													margin: 0 0 12px 0;
													font-size: 16px;
													font-weight: bold;
													color: #000000;
												"
											>
												Od czego zacząć?
											</p>
											<ul
												style="
													margin: 0;
													padding: 0 0 0 24px;
													color: #333333;
													font-size: 15px;
													line-height: 1.6;
												"
											>
												<li style="margin-bottom: 4px">
													Sprawdź swój dashboard.
												</li>
												<li style="margin-bottom: 4px">
													Spróbuj stworzyć pierwsze
													testowe wydarzenie.
												</li>
												<li>
													Jeśli coś nie działa albo
													masz pytania — odpowiedz na
													tego maila. Jesteśmy tutaj.
												</li>
											</ul>
										</td>
									</tr>

									<tr>
										<td
											style="
												padding: 20px 0;
												border-top: 1px solid #eeeeee;
											"
										>
											<p
												style="
													margin: 0 0 10px 0;
													font-size: 15px;
													color: #000000;
												"
											>
												Witamy w zespole pierwszych
												organizatorów!
											</p>
											<p
												style="
													margin: 0;
													font-size: 15px;
													font-weight: bold;
													color: #000000;
												"
											>
												Z poważaniem, Zespół
												StworzEvent.pl 🚀
											</p>
										</td>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>
				</tbody>
			</table>
		</div>`;
};

export type OrganizerNewOrderMailProps = {
	organizationName: string;
	eventTitle: string;
	orderNumber: string;
	buyerName: string;
	buyerSurname: string;
	buyerEmail: string;
	total: number;
	currency: string;
	ordersUrl: string;
};

export const organizerNewOrderMail = (
	data: OrganizerNewOrderMailProps,
): string => {
	const esc = (s: string) =>
		s
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");

	const formattedTotal = `${(data.total / 100).toFixed(2)} ${esc(data.currency)}`;

	return `
    <div style="background:#f5f5f5;padding:12px;font-family:Arial,sans-serif;text-align:center;box-sizing:border-box;width:100%">
      <table style="box-sizing:border-box;margin:0 auto;max-width:500px;background:white;border-radius:30px;padding:40px;width:100%;text-align:left">
        <tr>
          <th style="text-align:left">
            <img src="https://stworzevent.vercel.app/images/mails/logo_text_black.png" alt="logo" height="23" width="158" style="margin-bottom:32px" />
          </th>
        </tr>
        <tr>
          <td>
            <h1 style="margin:0 0 8px 0;font-size:24px;font-weight:bold;color:#000">Nowe zamówienie!</h1>
            <p style="margin:0 0 24px 0;font-size:15px;color:#555">Cześć <strong>${esc(data.organizationName)}</strong>, otrzymałeś nowe zamówienie na wydarzenie <strong>${esc(data.eventTitle)}</strong>.</p>
          </td>
        </tr>
        <tr>
          <td>
            <table width="100%" style="background:#f3f3f3;border-radius:16px;padding:20px;margin-bottom:16px">
              <tr>
                <td>
                  <p style="margin:0 0 4px 0;font-size:13px;color:#777">Numer zamówienia</p>
                  <p style="margin:0;font-size:16px;font-weight:bold;font-family:monospace;color:#000">${esc(data.orderNumber)}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <table width="100%" style="background:#f3f3f3;border-radius:16px;padding:20px;margin-bottom:24px">
              <tr>
                <td>
                  <p style="margin:0 0 8px 0;font-size:13px;color:#777">Dane kupującego</p>
                  <p style="margin:0 0 4px 0;font-size:14px;color:#333"><strong>${esc(data.buyerName)} ${esc(data.buyerSurname)}</strong></p>
                  <p style="margin:0 0 12px 0;font-size:14px;color:#555">${esc(data.buyerEmail)}</p>
                  <p style="margin:0 0 4px 0;font-size:13px;color:#777">Do zapłaty</p>
                  <p style="margin:0;font-size:18px;font-weight:bold;color:#000">${esc(formattedTotal)}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="text-align:center;padding-bottom:24px">
            <a href="${esc(data.ordersUrl)}" target="_blank" style="display:inline-block;padding:12px 24px;font-size:15px;font-weight:bold;color:#fff;background:#e86405;border-radius:12px;text-decoration:none">
              Przejdź do zamówień
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding-top:8px">
            <span style="font-size:14px;color:#777">Z pozdrowieniami,<br/>zespół StworzEvent.pl</span>
          </td>
        </tr>
      </table>
    </div>
  `;
};

export type OrderTicketParticipant = {
	ticketName: string;
	participantName: string;
	participantSurname: string;
	checkInCode: string;
};

export type OrderTicketsMailProps = {
	buyerName: string;
	eventTitle: string;
	eventDate: string;
	eventLocation: string | null;
	orderNumber: string;
	participants: OrderTicketParticipant[];
};

export const orderTicketsMail = (data: OrderTicketsMailProps): string => {
	const esc = (s: string) =>
		s
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");

	const ticketsHtml = data.participants
		.map(
			(p) => `
      <table width="100%" style="background:#f3f3f3;border-radius:16px;padding:20px;margin-bottom:12px">
        <tr>
          <td style="vertical-align:top;padding-right:16px">
            <p style="margin:0 0 4px 0;font-size:13px;color:#777">${esc(p.ticketName)}</p>
            <p style="margin:0;font-size:15px;font-weight:bold;color:#000">${esc(p.participantName)} ${esc(p.participantSurname)}</p>
            <p style="margin:4px 0 0 0;font-size:11px;color:#999;font-family:monospace">${esc(p.checkInCode)}</p>
          </td>
          <td style="vertical-align:top;text-align:right;width:100px">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(p.checkInCode)}"
              alt="QR"
              width="100"
              height="100"
              style="border-radius:8px"
            />
          </td>
        </tr>
      </table>
    `,
		)
		.join("");

	return `
    <div style="background:#f5f5f5;padding:12px;font-family:Arial,sans-serif;text-align:center;box-sizing:border-box;width:100%">
      <table style="box-sizing:border-box;margin:0 auto;max-width:500px;background:white;border-radius:30px;padding:40px;width:100%;text-align:left">
        <tr>
          <th style="text-align:left">
            <img src="https://stworzevent.vercel.app/images/mails/logo_text_black.png" alt="logo" height="23" width="158" style="margin-bottom:32px" />
          </th>
        </tr>
        <tr>
          <td>
            <h1 style="margin:0 0 8px 0;font-size:24px;font-weight:bold;color:#000">Twoje bilety!</h1>
            <p style="margin:0 0 24px 0;font-size:15px;color:#555">Cześć <strong>${esc(data.buyerName)}</strong>, Twoje zamówienie na <strong>${esc(data.eventTitle)}</strong> zostało potwierdzone. Poniżej znajdziesz swoje bilety.</p>
          </td>
        </tr>
        <tr>
          <td>
            <table width="100%" style="background:#f3f3f3;border-radius:16px;padding:20px;margin-bottom:24px">
              <tr>
                <td>
                  <p style="margin:0 0 4px 0;font-size:13px;color:#777">Numer zamówienia</p>
                  <p style="margin:0 0 12px 0;font-size:16px;font-weight:bold;font-family:monospace;color:#000">${esc(data.orderNumber)}</p>
                  <p style="margin:0 0 4px 0;font-size:13px;color:#777">Wydarzenie</p>
                  <p style="margin:0 0 4px 0;font-size:15px;font-weight:bold;color:#000">${esc(data.eventTitle)}</p>
                  <p style="margin:0 0 4px 0;font-size:14px;color:#555">${esc(data.eventDate)}</p>
                  ${data.eventLocation ? `<p style="margin:0;font-size:14px;color:#555">${esc(data.eventLocation)}</p>` : ""}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <p style="margin:0 0 12px 0;font-size:15px;font-weight:bold;color:#000">Bilety wstępu:</p>
            ${ticketsHtml}
          </td>
        </tr>
        <tr>
          <td style="padding-top:20px">
            <p style="margin:0 0 4px 0;font-size:13px;color:#999">Pokaż kod QR przy wejściu na wydarzenie.</p>
            <span style="font-size:14px;color:#777">Z pozdrowieniami,<br/>zespół StworzEvent.pl</span>
          </td>
        </tr>
      </table>
    </div>
  `;
};

export type OrderReminderMailProps = {
	buyerName: string;
	eventTitle: string;
	eventDate: string;
	eventLocation: string | null;
	eventUrl: string;
};

export const orderReminderMail = (data: OrderReminderMailProps): string => {
	const esc = (s: string) =>
		s
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");

	return `
    <div style="background:#f5f5f5;padding:12px;font-family:Arial,sans-serif;text-align:center;box-sizing:border-box;width:100%">
      <table style="box-sizing:border-box;margin:0 auto;max-width:500px;background:white;border-radius:30px;padding:40px;width:100%;text-align:left">
        <tr>
          <th style="text-align:left">
            <img src="https://stworzevent.vercel.app/images/mails/logo_text_black.png" alt="logo" height="23" width="158" style="margin-bottom:32px" />
          </th>
        </tr>
        <tr>
          <td>
            <h1 style="margin:0 0 8px 0;font-size:24px;font-weight:bold;color:#000">Jutro Twoje wydarzenie!</h1>
            <p style="margin:0 0 24px 0;font-size:15px;color:#555">Cześć <strong>${esc(data.buyerName)}</strong>, przypominamy że już jutro odbędzie się wydarzenie, na które masz bilet.</p>
          </td>
        </tr>
        <tr>
          <td>
            <table width="100%" style="background:#f3f3f3;border-radius:16px;padding:20px;margin-bottom:24px">
              <tr>
                <td>
                  <p style="margin:0 0 4px 0;font-size:13px;color:#777">Wydarzenie</p>
                  <p style="margin:0 0 8px 0;font-size:17px;font-weight:bold;color:#000">${esc(data.eventTitle)}</p>
                  <p style="margin:0 0 4px 0;font-size:14px;color:#555">${esc(data.eventDate)}</p>
                  ${data.eventLocation ? `<p style="margin:0;font-size:14px;color:#555">${esc(data.eventLocation)}</p>` : ""}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="text-align:center;padding-bottom:24px">
            <a href="${esc(data.eventUrl)}" target="_blank" style="display:inline-block;padding:12px 24px;font-size:15px;font-weight:bold;color:#fff;background:#e86405;border-radius:12px;text-decoration:none">
              Szczegóły wydarzenia
            </a>
          </td>
        </tr>
        <tr>
          <td>
            <p style="margin:0 0 4px 0;font-size:13px;color:#999">Nie zapomnij zabrać ze sobą potwierdzenia z kodem QR.</p>
            <span style="font-size:14px;color:#777">Z pozdrowieniami,<br/>zespół StworzEvent.pl</span>
          </td>
        </tr>
      </table>
    </div>
  `;
};

export type BetaSignupNotificationMailProps = {
	name: string;
	surname: string;
	email: string;
	company?: string | null;
};

export const betaSignupNotificationMail = (
	data: BetaSignupNotificationMailProps,
): string => {
	const esc = (s: string) =>
		s
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");

	return `
    <div style="background:#f5f5f5;padding:12px;font-family:Arial,sans-serif;box-sizing:border-box;width:100%">
      <table style="margin:0 auto;max-width:500px;background:white;border-radius:30px;padding:40px;width:100%">
        <tr>
          <td style="padding-bottom:32px">
            <img src="https://stworzevent.vercel.app/images/mails/logo_text_black.png" alt="logo" height="23" width="158" />
          </td>
        </tr>
        <tr>
          <td>
            <h1 style="margin:0 0 8px 0;font-size:22px;font-weight:bold;color:#000">Nowa rejestracja beta!</h1>
            <p style="margin:0 0 24px 0;font-size:15px;color:#555">Ktoś zapisał się na listę beta-testerów StworzEvent.pl.</p>
          </td>
        </tr>
        <tr>
          <td>
            <table width="100%" style="background:#f3f3f3;border-radius:16px;padding:20px">
              <tr>
                <td>
                  <p style="margin:0 0 4px 0;font-size:13px;color:#777">Imię i nazwisko</p>
                  <p style="margin:0 0 16px 0;font-size:16px;font-weight:bold;color:#000">${esc(data.name)} ${esc(data.surname)}</p>

                  <p style="margin:0 0 4px 0;font-size:13px;color:#777">Email</p>
                  <p style="margin:0 0 16px 0;font-size:15px;color:#000">
                    <a href="mailto:${esc(data.email)}" style="color:#e86405;text-decoration:none">${esc(data.email)}</a>
                  </p>

                  ${
										data.company
											? `<p style="margin:0 0 4px 0;font-size:13px;color:#777">Firma</p>
                         <p style="margin:0;font-size:15px;color:#000">${esc(data.company)}</p>`
											: `<p style="margin:0;font-size:13px;color:#aaa">Firma: nie podano</p>`
									}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding-top:20px">
            <span style="font-size:13px;color:#aaa">StworzEvent.pl — powiadomienie automatyczne</span>
          </td>
        </tr>
      </table>
    </div>
  `;
};

export const codeMail = (data: CodeMailsProps) => {
	return `<div
			style="
				background: #f5f5f5;
				font-family: Arial, sans-serif;
				text-align: center;
				box-sizing: border-box;
				width: 100%;
				height: 100%;
			"
		>
			<table
				role="presentation"
				border="0"
				cellspacing="0"
				cellpadding="0"
				style="
					background-color: #ffffff;
					max-width: 500px;
					margin: 0 auto;
					padding: 30px;
					height: 100%;
				"
			>
				<tbody>
					<tr>
						<td align="center" style="padding: 20px 0">
							<table
								role="presentation"
								border="0"
								cellspacing="0"
								cellpadding="0"
								style="
									width: 500px;
									margin: 0 auto;
									text-align: left;
								"
							>
								<tbody>
									<tr>
										<td
											style="
												padding: 0 0 20px 0;
												border-bottom: 1px solid #eeeeee;
												height: 30px;
											"
										>
											<img
												src="https://stworzevent.vercel.app/images/mails/logo_text_black.png"
												alt="StworzEvent.pl"
												width="180"
												style="
													display: block;
													border: 0;
												"
											/>
										</td>
									</tr>

									<tr>
										<td style="padding: 32px 0 16px 0">
											<h1
												style="
													margin: 0;
													font-size: 28px;
													font-weight: bold;
													color: #000000;
												"
											>
												${data.header}
											</h1>
										</td>
									</tr>

									<tr>
										<td style="padding: 0 0 30px 0">
											<p
												style="
													margin: 0;
													font-size: 16px;
													line-height: 1.4;
													color: #000000;
													font-weight: 500;
												"
											>
												${data.subheader}
											</p>
										</td>
									</tr>

									<tr>
										<td>
											<table
												role="presentation"
												width="100%"
												border="0"
												cellspacing="0"
												cellpadding="0"
												style="
													background-color: #e9e9e9;
													border-radius: 16px;
													overflow: hidden;
												"
											>
												<tbody>
													<tr>
														<td
															style="
																background-color: #000000;
																padding: 16px
																	20px;
															"
														>
															<p
																style="
																	margin: 0;
																	color: #ffffff;
																	font-size: 16px;
																	font-weight: bold;
																"
															>
																${data.ticket.name} –
																<span
																	style="
																		color: #ff7a1a;
																	"
																	>Beta
																	test</span
																>
															</p>
														</td>
													</tr>
													<tr>
														<td
															style="
																padding: 20px;
																background-color: rgb(
																	243,
																	243,
																	243
																);
															"
														>
															<p
																style="
																	margin: 0 0
																		15px 0;
																	font-size: 16px;
																	font-weight: bold;
																	color: #000000;
																"
															>
																Oficjalnie
																ruszamy z etapem
																zamkniętych
																testów beta
																StworzEvent.pl.
															</p>
															<p
																style="
																	margin: 0;
																	font-size: 16px;
																	color: #000000;
																"
															>
																Twoje konto jest
																już gotowe do
																działania.
															</p>
														</td>
													</tr>
													<tr>
														<td
															style="
																border-bottom: 2px
																	dashed #fff;
																font-size: 0;
																line-height: 0;
															"
														>
															&nbsp;
														</td>
													</tr>
													<tr>
														<td
															style="
																padding: 20px;
																background-color: rgb(
																	243,
																	243,
																	243
																);
															"
														>
															<p
																style="
																	margin: 0 0
																		20px 0;
																	font-size: 15px;
																	color: #000000;
																"
															>
																Pozostał ostatni
																krok —
																potwierdzenie
																konta i
																ustawienie hasła
																dostępu.
															</p>
															<table
																role="presentation"
																border="0"
																cellspacing="0"
																cellpadding="0"
															>
																<tbody>
																	<tr>
																		<td
																			align="center"
																			bgcolor="#ff7a1a"
																			style="
																				border-radius: 12px;
																			"
																		>
																			<a
																				href="${data.link}"
																				target="_blank"
																				style="
																					display: inline-block;
																					padding: 12px
																						20px;
																					font-size: 16px;
																					font-weight: bold;
																					color: #ffffff;
																					text-decoration: none;
																				"
																				>Wejdź
																				do
																				platformy</a
																			>
																		</td>
																	</tr>
																</tbody>
															</table>
														</td>
													</tr>
												</tbody>
											</table>
										</td>
									</tr>

									<tr>
										<td style="padding: 24px 0 20px 0">
											<p
												style="
													margin: 0 0 12px 0;
													font-size: 16px;
													font-weight: bold;
													color: #000000;
												"
											>
												Od czego zacząć?
											</p>
											<ul
												style="
													margin: 0;
													padding: 0 0 0 24px;
													color: #333333;
													font-size: 15px;
													line-height: 1.6;
												"
											>
												<li style="margin-bottom: 4px">
													Sprawdź swój dashboard.
												</li>
												<li style="margin-bottom: 4px">
													Spróbuj stworzyć pierwsze
													testowe wydarzenie.
												</li>
												<li>
													Jeśli coś nie działa albo
													masz pytania — odpowiedz na
													tego maila. Jesteśmy tutaj.
												</li>
											</ul>
										</td>
									</tr>

									<tr>
										<td
											style="
												padding: 20px 0;
												border-top: 1px solid #eeeeee;
											"
										>
											<p
												style="
													margin: 0 0 10px 0;
													font-size: 15px;
													color: #000000;
												"
											>
												Witamy w zespole pierwszych
												organizatorów!
											</p>
											<p
												style="
													margin: 0;
													font-size: 15px;
													font-weight: bold;
													color: #000000;
												"
											>
												Z poważaniem, Zespół
												StworzEvent.pl 🚀
											</p>
										</td>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>
				</tbody>
			</table>
		</div>`;
};
