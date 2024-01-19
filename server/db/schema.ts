import {
  mysqlTable,
  index,
  primaryKey,
  varchar,
  mediumtext,
  datetime,
  json,
  mysqlEnum,
  int,
  unique,
} from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";

export const comments = mysqlTable(
  "Comments",
  {
    id: varchar("id", { length: 191 }).notNull(),
    content: mediumtext("content").notNull(),
    eventId: varchar("eventId", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      eventIdIdx: index("Comments_eventId_idx").on(table.eventId),
      userIdIdx: index("Comments_userId_idx").on(table.userId),
      commentId: primaryKey({ columns: [table.id], name: "Comments_id" }),
    };
  }
);

export const commentsRelations = relations(comments, ({ one }) => ({
  event: one(events, { fields: [comments.id], references: [events.cuid] }),
  user: one(users, { fields: [comments.id], references: [users.id] }),
}));

export const events = mysqlTable(
  "Events",
  {
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
    event: json("event").notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    endDateTime: datetime("endDateTime", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    startDateTime: datetime("startDateTime", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    cuid: varchar("cuid", { length: 191 }).notNull(),
    visibility: mysqlEnum("visibility", ["public", "private"])
      .default("public")
      .notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("Events_userId_idx").on(table.userId),
      eventCuid: primaryKey({ columns: [table.cuid], name: "Events_cuid" }),
    };
  }
);

export const eventRelations = relations(events, ({ one, many }) => ({
  users: one(users, { fields: [events.userId], references: [users.id] }),
  eventsToLists: many(eventsToLists),
  comment: many(comments),
  followEvents: many(followEvents),
}));

export const eventsToLists = mysqlTable(
  "EventsToLists",
  {
    eventId: varchar("eventId", { length: 191 }).notNull(),
    listId: varchar("listId", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.eventId, table.listId] }),
    };
  }
);

export const eventsToListsRelations = relations(eventsToLists, ({ one }) => ({
  event: one(events, {
    fields: [eventsToLists.eventId],
    references: [events.cuid],
  }),
  list: one(lists, { fields: [eventsToLists.listId], references: [lists.id] }),
}));

export const followEvents = mysqlTable(
  "FollowEvents",
  {
    userId: varchar("userId", { length: 191 }).notNull(),
    eventId: varchar("eventId", { length: 191 }).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("FollowEvents_userId_idx").on(table.userId),
      eventIdIdx: index("FollowEvents_eventId_idx").on(table.eventId),
      followEventUserIdEventId: primaryKey({
        columns: [table.userId, table.eventId],
        name: "FollowEvents_userId_eventId",
      }),
    };
  }
);

export const followEventsRelations = relations(followEvents, ({ one }) => ({
  user: one(users, { fields: [followEvents.userId], references: [users.id] }),
  event: one(events, {
    fields: [followEvents.eventId],
    references: [events.cuid],
  }),
}));

export const followLists = mysqlTable(
  "FollowLists",
  {
    userId: varchar("userId", { length: 191 }).notNull(),
    listId: varchar("listId", { length: 191 }).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("FollowLists_userId_idx").on(table.userId),
      listIdIdx: index("FollowLists_listId_idx").on(table.listId),
      followListUserIdListId: primaryKey({
        columns: [table.userId, table.listId],
        name: "FollowLists_userId_listId",
      }),
    };
  }
);

export const followListsRelations = relations(followLists, ({ one }) => ({
  user: one(users, { fields: [followLists.userId], references: [users.id] }),
  list: one(lists, { fields: [followLists.listId], references: [lists.id] }),
}));

export const followUsers = mysqlTable(
  "FollowUsers",
  {
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
    followerId: varchar("followerId", { length: 191 }).notNull(),
    followingId: varchar("followingId", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      followerIdIdx: index("FollowUsers_followerId_idx").on(table.followerId),
      followingIdIdx: index("FollowUsers_followingId_idx").on(
        table.followingId
      ),
      followUserFollowerIdFollowingId: primaryKey({
        columns: [table.followerId, table.followingId],
        name: "FollowUsers_followerId_followingId",
      }),
    };
  }
);

export const followUsersRelations = relations(followUsers, ({ one }) => ({
  follower: one(users, {
    fields: [followUsers.followerId],
    references: [users.id],
    relationName: "follower",
  }),
  following: one(users, {
    fields: [followUsers.followingId],
    references: [users.id],
    relationName: "following",
  }),
}));

export const lists = mysqlTable(
  "Lists",
  {
    name: varchar("name", { length: 191 }).notNull(),
    description: varchar("description", { length: 191 }).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
    id: varchar("id", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("Lists_userId_idx").on(table.userId),
      listId: primaryKey({ columns: [table.id], name: "Lists_id" }),
    };
  }
);

export const listsRelations = relations(lists, ({ one, many }) => ({
  user: one(users, { fields: [lists.userId], references: [users.id] }),
  eventToList: many(eventsToLists),
}));

export const requestResponses = mysqlTable(
  "RequestResponses",
  {
    id: varchar("id", { length: 191 }).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
    modelOutput: json("modelOutput"),
    modelInput: json("modelInput").notNull(),
    modelStatus: varchar("modelStatus", { length: 191 })
      .default("idle")
      .notNull(),
    source: varchar("source", { length: 191 }).default("unknown").notNull(),
    modelCompletionTime: int("modelCompletionTime"),
    parsedOutput: json("parsedOutput"),
  },
  (table) => {
    return {
      requestResponsesId: primaryKey({
        columns: [table.id],
        name: "RequestResponses_id",
      }),
    };
  }
);

export const users = mysqlTable(
  "Users",
  {
    id: varchar("id", { length: 191 }).notNull(),
    username: varchar("username", { length: 191 }).notNull(),
    email: varchar("email", { length: 191 }).notNull(),
    displayName: varchar("displayName", { length: 191 }).notNull(),
    userImage: varchar("userImage", { length: 191 }).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      userId: primaryKey({ columns: [table.id], name: "Users_id" }),
      userUsernameKey: unique("Users_username_key").on(table.username),
      userEmailKey: unique("Users_email_key").on(table.email),
    };
  }
);

export const userRelations = relations(users, ({ one, many }) => ({
  event: many(events),
  followEvent: many(followEvents),
  followList: many(followLists),
  follower: many(followUsers, { relationName: "follower" }),
  following: many(followUsers, { relationName: "following" }),
  list: many(lists),
}));

export const waitlistSignups = mysqlTable(
  "WaitlistSignups",
  {
    id: varchar("id", { length: 191 }).notNull(),
    email: varchar("email", { length: 191 }).notNull(),
    zipcode: varchar("zipcode", { length: 191 }).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
    why: varchar("why", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      waitlistSignupsId: primaryKey({
        columns: [table.id],
        name: "WaitlistSignups_id",
      }),
      waitlistSignupsEmailKey: unique("WaitlistSignups_email_key").on(
        table.email
      ),
    };
  }
);
