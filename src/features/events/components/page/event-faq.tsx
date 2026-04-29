import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Typography } from "@/shared/components";
import { EventFaq } from "@prisma/client";
import { IconHelpHexagon } from "@tabler/icons-react";

const EventFAQSection = ({ faqs }: { faqs: EventFaq[] }) => {
	return (
		<section className="w-full flex flex-col items-start justify-center gap-4">
			<header className="w-full flex gap-2 items-center">
				<IconHelpHexagon className="w-6 h-6 text-primary" />
				<Typography variant="h3">FAQ</Typography>
			</header>
			<Accordion type="multiple" className="w-full">
				{faqs.map((faq) => (
					<AccordionItem key={faq.id} value={faq.id} className="py-2">
						<AccordionTrigger className="text-base">
							{faq.question}
						</AccordionTrigger>
						<AccordionContent className="text-base prose prose-neutral">
							{faq.answer}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</section>
	);
};

export default EventFAQSection;
