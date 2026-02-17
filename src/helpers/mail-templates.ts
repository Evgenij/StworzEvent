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
												Dzień dobry!
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
												Zostałeś wybrany jako jeden z
												pierwszych organizatorów
												testujących platformę.
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
																StworzEvent.pl –
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
																				href="#"
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
