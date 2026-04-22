import * as arctic from "arctic";
import { env } from "$env/dynamic/private";

function normalize(url: string): string {
	return url.replace(/\/+$/g, "");
}

function getBaseUrl(): string {
	if (env.ORIGIN) return normalize(env.ORIGIN);

	const host = env.VERCEL_URL || env.DEPLOYMENT_URL;
	if (host) {
		// Vercel/other platforms often provide host without protocol
		if (/^https?:\/\//i.test(host)) return normalize(host);
		return `https://${normalize(host)}`;
	}

	return "http://localhost:5173";
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
