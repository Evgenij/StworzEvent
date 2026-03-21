// src/components/dashboard/events/faq/faq-item-card.tsx
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/shadcn/ui/collapsible";
import { Button } from "@/components/shadcn/ui/button";
import { Label } from "@/components/shadcn/ui/label";
import { Field, FieldError } from "@/components/shadcn/ui/field";
import {
	InputGroup,
	InputGroupInput,
} from "@/components/shadcn/ui/input-group";
import { Textarea } from "@/components/shadcn/ui/textarea";
import {
	IconChevronDown,
	IconChevronUp,
	IconTrash,
	IconLoader2,
} from "@tabler/icons-react";
import { faqItemSchema, type FaqItemInput } from "@/schemas/faq-item.schema";
import { upsertFaqItemAction } from "@/actions/events/faq/upsert-faq-item.action";
import { deleteFaqItemAction } from "@/actions/events/faq/delete-faq-item.action";
import { toast } from "sonner";
import type { FaqItem } from "@/actions/events/faq/get-event-faq.action";

type Props = {
	eventId: string;
	item: FaqItem;
	onDelete: (id: string) => void;
	onSave: (id: string, data: FaqItem) => void;
};

export function FaqItemCard({ eventId, item, onDelete, onSave }: Props) {
	const t = useTranslations("EventWizard.faq");
	const tErrors = useTranslations("CreateEventErrors");
	const [isOpen, setIsOpen] = useState(!item.question);
	const [isDeleting, setIsDeleting] = useState(false);

	const form = useForm<FaqItemInput>({
		resolver: zodResolver(faqItemSchema(tErrors)),
		defaultValues: {
			question: item.question,
			answer: item.answer,
		},
		mode: "onBlur",
		reValidateMode: "onBlur",
	});

	const {
		handleSubmit,
		control,
		formState: { isSubmitting },
	} = form;

	const onSubmit = async (data: FaqItemInput) => {
		const result = await upsertFaqItemAction({
			eventId,
			itemId: item.id,
			data,
		});

		if (!result.success) {
			toast.error(t("errors.saveFailed"));
			return;
		}

		toast.success(t("saved"));
		setIsOpen(false);
		onSave(item.id, {
			...item,
			question: data.question,
			answer: data.answer,
		});
	};

	const handleDelete = async () => {
		setIsDeleting(true);
		const result = await deleteFaqItemAction(item.id);
		setIsDeleting(false);

		if (!result.success) {
			toast.error(t("errors.deleteFailed"));
			return;
		}

		onDelete(item.id);
	};

	return (
		<div className="rounded-lg border bg-card">
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				{/* Header */}
				<div className="flex items-center gap-2 p-3">
					<p className="flex-1 truncate text-sm font-medium">
						{item.question || t("newItem")}
					</p>

					<div className="flex items-center gap-1">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							disabled={isDeleting}
							onClick={handleDelete}
							className="text-destructive hover:text-destructive"
						>
							{isDeleting ? (
								<IconLoader2 className="size-4 animate-spin" />
							) : (
								<IconTrash className="size-4" />
							)}
						</Button>

						<CollapsibleTrigger asChild>
							<Button type="button" variant="ghost" size="sm">
								{isOpen ? (
									<IconChevronUp className="size-4" />
								) : (
									<IconChevronDown className="size-4" />
								)}
							</Button>
						</CollapsibleTrigger>
					</div>
				</div>

				{/* Body */}
				<CollapsibleContent>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-3 border-t p-3"
					>
						{/* Вопрос */}
						<Controller
							name="question"
							control={control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<Label>{t("question")}</Label>
									<InputGroup>
										<InputGroupInput
											{...field}
											aria-invalid={fieldState.invalid}
											placeholder={t(
												"questionPlaceholder",
											)}
										/>
									</InputGroup>
									{fieldState.invalid && (
										<FieldError
											errors={[fieldState.error]}
										/>
									)}
								</Field>
							)}
						/>

						{/* Ответ */}
						<Controller
							name="answer"
							control={control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<Label>{t("answer")}</Label>
									<Textarea
										{...field}
										rows={3}
										aria-invalid={fieldState.invalid}
										placeholder={t("answerPlaceholder")}
									/>
									{fieldState.invalid && (
										<FieldError
											errors={[fieldState.error]}
										/>
									)}
								</Field>
							)}
						/>

						<Button
							type="submit"
							size="sm"
							disabled={isSubmitting}
							className="self-end"
						>
							{isSubmitting ? (
								<>
									<IconLoader2 className="mr-2 size-4 animate-spin" />
									{t("saving")}
								</>
							) : (
								t("save")
							)}
						</Button>
					</form>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
}
