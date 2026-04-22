import { pgTable, text, timestamp, foreignKey, unique, bigint, boolean, uniqueIndex } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const appSettings = pgTable("app_settings", {
	key: text().primaryKey().notNull(),
	value: text().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const pages = pgTable("pages", {
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	slug: text().notNull(),
	content: text().default(').notNull(),
	template: text().default('default').notNull(),
	status: text().default('draft').notNull(),
	authorId: text("author_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	publishedAt: timestamp("published_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [users.id],
			name: "pages_author_id_users_id_fk"
		}),
	unique("pages_slug_unique").on(table.slug),
]);

export const sessions = pgTable("sessions", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	expiresAt: bigint("expires_at", { mode: "number" }).notNull(),
	userAgent: text("user_agent"),
	ipAddress: text("ip_address"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "sessions_user_id_users_id_fk"
		}),
]);

export const passwordResetTokens = pgTable("password_reset_tokens", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	tokenHash: text("token_hash").notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "password_reset_tokens_user_id_users_id_fk"
		}),
]);

export const users = pgTable("users", {
	id: text().primaryKey().notNull(),
	email: text().notNull(),
	username: text().notNull(),
	passwordHash: text("password_hash").notNull(),
	name: text().notNull(),
	avatarUrl: text("avatar_url"),
	role: text().default('viewer').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
	unique("users_username_unique").on(table.username),
]);

export const notifications = pgTable("notifications", {
	id: text().primaryKey().notNull(),
	userId: text("user_id"),
	title: text().notNull(),
	message: text().notNull(),
	type: text().default('info').notNull(),
	read: boolean().default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "notifications_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const oauthAccounts = pgTable("oauth_accounts", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	provider: text().notNull(),
	providerUserId: text("provider_user_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("oauth_provider_user_idx").using("btree", table.provider.asc().nullsLast().op("text_ops"), table.providerUserId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "oauth_accounts_user_id_users_id_fk"
		}),
]);
