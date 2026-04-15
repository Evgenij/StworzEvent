import React from "react";

const FormRow = ({ children }: { children: React.ReactNode }) => {
	return <div className="flex gap-2">{children}</div>;
};

export default FormRow;
