import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// /api/auth/signin
// /api/auth/signup
// /api/auth/logout
