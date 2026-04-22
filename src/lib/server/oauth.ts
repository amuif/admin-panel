import * as arctic from "arctic";
import { env } from "$env/dynamic/private";

function getBaseUrl(): string {
	return env.ORIGIN || "http://localhost:5173";
}

export const google =
	env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
		? new arctic.Google(
			env.GOOGLE_CLIENT_ID,
			env.GOOGLE_CLIENT_SECRET,
			`${getBaseUrl()}/login/google/callback`
		)
		: null;

export function getEnabledProviders(): string[] {
	const providers: string[] = [];
	if (google) providers.push("google");
	return providers;
}
