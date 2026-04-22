import { relations } from "drizzle-orm/relations";
import { users, pages, sessions, passwordResetTokens, notifications, oauthAccounts } from "./schema";

export const pagesRelations = relations(pages, ({one}) => ({
	user: one(users, {
		fields: [pages.authorId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	pages: many(pages),
	sessions: many(sessions),
	passwordResetTokens: many(passwordResetTokens),
	notifications: many(notifications),
	oauthAccounts: many(oauthAccounts),
}));

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
}));

export const passwordResetTokensRelations = relations(passwordResetTokens, ({one}) => ({
	user: one(users, {
		fields: [passwordResetTokens.userId],
		references: [users.id]
	}),
}));

export const notificationsRelations = relations(notifications, ({one}) => ({
	user: one(users, {
		fields: [notifications.userId],
		references: [users.id]
	}),
}));

export const oauthAccountsRelations = relations(oauthAccounts, ({one}) => ({
	user: one(users, {
		fields: [oauthAccounts.userId],
		references: [users.id]
	}),
}));