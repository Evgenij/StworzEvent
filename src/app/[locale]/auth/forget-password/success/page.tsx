import { SIGNIN_ROUTE } from "@/config/routes";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { IconChevronLeft } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { Typography } from "@/shared/components";

const SuccessPage = async () => {
	const t = await getTranslations("ForgetPasswordForm");

	return (
		<div className="flex flex-col gap-9">
			<header className="flex flex-col gap-3 items-center">
				<Typography variant="h2" className="text-center text-sm">
					{t("success.title")}
				</Typography>

				<p className="text-muted-foreground text-center text-sm">
					{t.rich("success.subtitle", {
						lineBreak: () => <br />,
						// Можно даже стилизовать части текста:
						important: (chunks) => (
							<span className="text-primary font-bold">
								{chunks}
							</span>
						),
					})}
				</p>
			</header>

			<main className="flex flex-col gap-4">
				<Link href={SIGNIN_ROUTE}>
					<Button
						type="submit"
						variant={"outline"}
						size={"lg"}
						className="w-full"
					>
						<IconChevronLeft />
						{t("success.button")}
					</Button>
				</Link>

				<p className="text-muted-foreground text-sm text-center">
					{t("rememberPassword")}{" "}
					<Link href={SIGNIN_ROUTE} className="link-default">
						{t("signIn")}
					</Link>
				</p>
			</main>
		</div>
	);
};

export default SuccessPage;
