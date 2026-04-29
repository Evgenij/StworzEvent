"use client";

import { updateUser } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { IconCheck } from "@tabler/icons-react";
import React from "react";

type Props = {
	name: string | undefined;
	image: string | undefined | null;
};

const UpdateUserForm = ({ image, name }: Props) => {
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// console.log("!");

		await updateUser({
			name: name,
			image: image ? image : null,
		});
	};

	return (
		<div className="flex flex-col gap-6">
			<form action="" onSubmit={handleSubmit}>
				<Button variant={"secondary"}>
					<IconCheck /> Save data
				</Button>
			</form>
		</div>
	);
};

export default UpdateUserForm;
