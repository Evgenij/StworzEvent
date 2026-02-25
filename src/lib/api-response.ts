import { NextResponse } from "next/server";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";

export function successResponse<T>(data: T, status = 200) {
	return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(error: unknown) {
	if (error instanceof ApiError) {
		return NextResponse.json(
			{ success: false, code: error.code, message: error.message },
			{ status: error.statusCode ?? 400 },
		);
	}

	console.error(error);
	return NextResponse.json(
		{
			success: false,
			code: ErrorCode.FETCH_FAILED,
			message: "Internal server error",
		},
		{ status: 500 },
	);
}

// Универсальная обёртка
export function withApiHandler(
	handler: (req: Request) => Promise<NextResponse>,
) {
	return async (req: Request) => {
		try {
			return await handler(req);
		} catch (error) {
			return errorResponse(error);
		}
	};
}
