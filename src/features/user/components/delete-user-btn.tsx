"use client";

import { deleteUserAction } from "@/actions/delete-user.action";
import { Button } from "@/components/shadcn/ui/button";
import { IconLoader, IconTrash } from "@tabler/icons-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface Props {
	userId: string;
	role: string;
}

function DeleteUserBtn({ userId, role }: Props) {
	const [isPending, setIsPending] = useState(false);

	const handleClick = async () => {
		setIsPending(true);
		const error = await deleteUserAction({ userId });
		if (error.error) {
			toast.error(error.message);
		} else {
			toast.success("User deleted successfully");
		}
		setIsPending(false);
	};

	return (
		<Button
			variant={"destructive"}
			size={"xs"}
			disabled={isPending || role !== "USER"}
			onClick={handleClick}
		>
			Delete
			{isPending ? (
				<IconLoader className="animate-spin"></IconLoader>
			) : (
				<IconTrash />
			)}
		</Button>
	);
}

export default DeleteUserBtn;
