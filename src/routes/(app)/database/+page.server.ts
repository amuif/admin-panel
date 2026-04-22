import { db } from "$lib/server/db/index.js";
import { users, sessions, pages, notifications, appSettings } from "$lib/server/db/schema.js";
import { sql, count } from "drizzle-orm";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user!.role !== "admin") {
		error(403, "Admin access required");
	}

	// Get table row counts
	const [usersCount] = await db.select({ count: count() }).from(users);
	const [sessionsCount] = await db.select({ count: count() }).from(sessions);
	const [pagesCount] = await db.select({ count: count() }).from(pages);
	const [notificationsCount] = await db.select({ count: count() }).from(notifications);
	const [settingsCount] = await db.select({ count: count() }).from(appSettings);

	// Get Postgres version
	const [versionRow] = await db.execute<{ version: string }>(sql`SELECT version()`);
	const dbVersion = (versionRow as { version: string })?.version ?? "PostgreSQL";

	const tables = [
		{ name: "users", rows: usersCount.count },
		{ name: "sessions", rows: sessionsCount.count },
		{ name: "pages", rows: pagesCount.count },
		{ name: "notifications", rows: notificationsCount.count },
		{ name: "app_settings", rows: settingsCount.count },
	];

	return {
		dbType: "PostgreSQL",
		dbVersion,
		tables,
		totalRows: tables.reduce((sum, t) => sum + t.rows, 0),
	};
};
