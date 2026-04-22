import { boolean, index, uniqueIndex } from "drizzle-orm/pg-core";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	email: text("email").notNull().unique(),
	username: text("username").notNull().unique(),
	passwordHash: text("password_hash").notNull(),
	name: text("name").notNull(),
	avatarUrl: text("avatar_url"),
	role: text("role", { enum: ["admin", "editor", "viewer"] })
		.notNull()
		.default("viewer"),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow()
		.notNull()
		.$defaultFn(() => new Date()),
});

export const sessions = pgTable("sessions", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
	userAgent: text("user_agent"),
	ipAddress: text("ip_address"),
	createdAt: timestamp("created_at", { mode: "date" },).defaultNow().notNull(),
});

export const pages = pgTable("pages", {
	id: text("id").primaryKey(),
	title: text("title").notNull(),
	slug: text("slug").notNull().unique(),
	content: text("content").notNull().default(""),
	template: text("template", { enum: ["default", "landing", "blog"] })
		.notNull()
		.default("default"),
	status: text("status", { enum: ["draft", "published", "archived"] })
		.notNull()
		.default("draft"),
	authorId: text("author_id")
		.notNull()
		.references(() => users.id),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow()
		.notNull()
		.$defaultFn(() => new Date()),
	publishedAt: timestamp("published_at"),
});

export const notifications = pgTable("notifications", {
	id: text("id").primaryKey(),
	userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
	title: text("title").notNull(),
	message: text("message").notNull(),
	type: text("type", { enum: ["info", "warning", "error", "success"] })
		.notNull()
		.default("info"),
	read: boolean("read").notNull().default(false),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	tokenHash: text("token_hash").notNull(),
	expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
});

export const oauthAccounts = pgTable(
	"oauth_accounts",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id),
		provider: text("provider", { enum: ["google", "github"] }).notNull(),
		providerUserId: text("provider_user_id").notNull(),
		created_at: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	},
	(table) => [uniqueIndex("oauth_provider_user_idx").on(table.provider, table.providerUserId)]
);

export const appSettings = pgTable("app_settings", {
	key: text("key").primaryKey(),
	value: text("value").notNull(),
	updatedAt: timestamp("updated_at").defaultNow()
		.notNull()
		.$defaultFn(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type Page = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type OAuthAccount = typeof oauthAccounts.$inferSelect;
export type AppSetting = typeof appSettings.$inferSelect;