import { db } from "$lib/server/db/index.js";
import { users, pages, notifications } from "$lib/server/db/schema.js";
import { sql, eq, count } from "drizzle-orm";
import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async () => {
	// User signups per month
	const signupsPerMonth = await db
		.select({
			month: sql<string>`to_char(${users.createdAt}, 'YYYY-MM-01')`,
			count: count(),
		})
		.from(users)
		.groupBy(sql`to_char(${users.createdAt}, 'YYYY-MM-01')`)
		.orderBy(sql`to_char(${users.createdAt}, 'YYYY-MM-01')`);

	// Content creation per month
	const pagesPerMonth = await db
		.select({
			month: sql<string>`to_char(${pages.createdAt}, 'YYYY-MM-01')`,
			count: count(),
		})
		.from(pages)
		.groupBy(sql`to_char(${pages.createdAt}, 'YYYY-MM-01')`)
		.orderBy(sql`to_char(${pages.createdAt}, 'YYYY-MM-01')`);

	// Pages by status
	const pagesByStatus = await db
		.select({
			status: pages.status,
			count: count(),
		})
		.from(pages)
		.groupBy(pages.status);

	// Notifications by type
	const notificationsByType = await db
		.select({
			type: notifications.type,
			count: count(),
		})
		.from(notifications)
		.groupBy(notifications.type);

	// Top authors by page count
	const topAuthors = await db
		.select({
			name: users.name,
			pageCount: count(pages.id),
		})
		.from(pages)
		.innerJoin(users, eq(pages.authorId, users.id))
		.groupBy(users.id, users.name)
		.orderBy(sql`count(${pages.id}) desc`)
		.limit(5);

	return {
		signupsPerMonth,
		pagesPerMonth,
		pagesByStatus,
		notificationsByType,
		topAuthors,
	};
};
