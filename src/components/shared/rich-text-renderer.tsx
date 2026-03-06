"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

type RichTextRendererProps = {
	content: any;
	editable?: boolean;
};

export const RichTextRenderer = ({
	content,
	editable = false,
}: RichTextRendererProps) => {
	const parsedContent =
		typeof content === "string" ? JSON.parse(content) : content;
	const editor = useEditor({
		extensions: [StarterKit, Image, Link],
		content: parsedContent,
		editable,
		immediatelyRender: false,
	});

	return (
		<EditorContent
			editor={editor}
			className="prose prose-neutral max-w-none [&_li_p]:my-0 [&_ul]:my-2"
		/>
	);
};
