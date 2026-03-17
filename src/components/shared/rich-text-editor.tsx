"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { cn } from "@/lib/utils";
import {
	IconBold,
	IconItalic,
	IconStrikethrough,
	IconCode,
	IconUnderline,
	IconHighlight,
	IconLink,
	IconUnlink,
	IconSuperscript,
	IconSubscript,
	IconList,
	IconListNumbers,
	IconH1,
	IconH2,
	IconH3,
	IconAlignLeft,
	IconAlignCenter,
	IconAlignRight,
	IconAlignJustified,
	IconArrowBack,
	IconArrowForward,
	IconClearFormatting,
	IconIndentIncrease,
} from "@tabler/icons-react";

type Props = {
	value?: any;
	onChange?: (value: any) => void;
	disabled?: boolean;
	className?: string;
};

export const RichTextEditor = ({
	value,
	onChange,
	disabled,
	className,
}: Props) => {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Image,
			Underline,
			Subscript,
			Superscript,
			Highlight,
			TextAlign.configure({ types: ["heading", "paragraph"] }),
			Link.configure({ openOnClick: false }),
		],
		content: value ?? "",
		editable: !disabled,
		immediatelyRender: false,
		onUpdate: ({ editor }) => {
			onChange?.(editor.getJSON());
		},
	});

	if (!editor) return null;

	const setLink = () => {
		const prev = editor.getAttributes("link").href;
		const url = window.prompt("URL", prev);
		if (url === null) return;
		if (url === "") {
			editor.chain().focus().extendMarkRange("link").unsetLink().run();
			return;
		}
		editor
			.chain()
			.focus()
			.extendMarkRange("link")
			.setLink({ href: url })
			.run();
	};

	return (
		<div
			className={cn(
				"rounded-md border focus-within:ring-1 focus-within:ring-ring",
				className,
			)}
		>
			<div className="flex flex-wrap items-center gap-0.5 border-b p-1.5">
				{/* History */}
				<ToolbarButton
					onClick={() => editor.chain().focus().undo().run()}
					disabled={!editor.can().undo()}
				>
					<IconArrowBack className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().redo().run()}
					disabled={!editor.can().redo()}
				>
					<IconArrowForward className="size-4" />
				</ToolbarButton>

				<Divider />

				{/* Heading */}
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					}
					active={editor.isActive("heading", { level: 1 })}
				>
					<IconH1 className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
					active={editor.isActive("heading", { level: 2 })}
				>
					<IconH2 className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					}
					active={editor.isActive("heading", { level: 3 })}
				>
					<IconH3 className="size-4" />
				</ToolbarButton>

				<Divider />

				{/* Lists */}
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleBulletList().run()
					}
					active={editor.isActive("bulletList")}
				>
					<IconList className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleOrderedList().run()
					}
					active={editor.isActive("orderedList")}
				>
					<IconListNumbers className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().sinkListItem("listItem").run()
					}
				>
					<IconIndentIncrease className="size-4" />
				</ToolbarButton>

				<Divider />

				{/* Clear formatting */}
				<ToolbarButton
					onClick={() =>
						editor
							.chain()
							.focus()
							.clearNodes()
							.unsetAllMarks()
							.run()
					}
				>
					<IconClearFormatting className="size-4" />
				</ToolbarButton>

				<Divider />

				{/* Inline marks */}
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleBold().run()}
					active={editor.isActive("bold")}
				>
					<IconBold className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleItalic().run()}
					active={editor.isActive("italic")}
				>
					<IconItalic className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleStrike().run()}
					active={editor.isActive("strike")}
				>
					<IconStrikethrough className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleCode().run()}
					active={editor.isActive("code")}
				>
					<IconCode className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleUnderline().run()
					}
					active={editor.isActive("underline")}
				>
					<IconUnderline className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleHighlight().run()
					}
					active={editor.isActive("highlight")}
				>
					<IconHighlight className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={setLink}
					active={editor.isActive("link")}
				>
					<IconLink className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().unsetLink().run()}
					disabled={!editor.isActive("link")}
				>
					<IconUnlink className="size-4" />
				</ToolbarButton>

				<Divider />

				{/* Superscript / Subscript */}
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleSuperscript().run()
					}
					active={editor.isActive("superscript")}
				>
					<IconSuperscript className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleSubscript().run()
					}
					active={editor.isActive("subscript")}
				>
					<IconSubscript className="size-4" />
				</ToolbarButton>

				<Divider />

				{/* Align */}
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().setTextAlign("left").run()
					}
					active={editor.isActive({ textAlign: "left" })}
				>
					<IconAlignLeft className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().setTextAlign("center").run()
					}
					active={editor.isActive({ textAlign: "center" })}
				>
					<IconAlignCenter className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().setTextAlign("right").run()
					}
					active={editor.isActive({ textAlign: "right" })}
				>
					<IconAlignRight className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().setTextAlign("justify").run()
					}
					active={editor.isActive({ textAlign: "justify" })}
				>
					<IconAlignJustified className="size-4" />
				</ToolbarButton>
			</div>

			<EditorContent editor={editor} className="p-3 text-sm" />
		</div>
	);
};

type ToolbarButtonProps = {
	onClick: () => void;
	active?: boolean;
	disabled?: boolean;
	children: React.ReactNode;
};

const ToolbarButton = ({
	onClick,
	active,
	disabled,
	children,
}: ToolbarButtonProps) => (
	<button
		type="button"
		onClick={onClick}
		disabled={disabled}
		className={cn(
			"rounded p-1.5 transition-colors hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed",
			active ? "bg-muted text-foreground" : "text-muted-foreground",
		)}
	>
		{children}
	</button>
);

const Divider = () => <div className="mx-1 h-5 w-px bg-border" />;
