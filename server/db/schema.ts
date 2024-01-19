import {
  mysqlTable,
  mysqlSchema,
  AnyMySqlColumn,
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
import { sql } from "drizzle-orm";

export const comment = mysqlTable(
  "Comment",
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
      eventIdIdx: index("Comment_eventId_idx").on(table.eventId),
      userIdIdx: index("Comment_userId_idx").on(table.userId),
      commentId: primaryKey({ columns: [table.id], name: "Comment_id" }),
    };
  }
);

export const event = mysqlTable(
  "Event",
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
      userIdIdx: index("Event_userId_idx").on(table.userId),
      eventCuid: primaryKey({ columns: [table.cuid], name: "Event_cuid" }),
    };
  }
);

export const followEvent = mysqlTable(
  "FollowEvent",
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
      userIdIdx: index("FollowEvent_userId_idx").on(table.userId),
      eventIdIdx: index("FollowEvent_eventId_idx").on(table.eventId),
      followEventUserIdEventId: primaryKey({
        columns: [table.userId, table.eventId],
        name: "FollowEvent_userId_eventId",
      }),
    };
  }
);

export const followList = mysqlTable(
  "FollowList",
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
      userIdIdx: index("FollowList_userId_idx").on(table.userId),
      listIdIdx: index("FollowList_listId_idx").on(table.listId),
      followListUserIdListId: primaryKey({
        columns: [table.userId, table.listId],
        name: "FollowList_userId_listId",
      }),
    };
  }
);

export const followUser = mysqlTable(
  "FollowUser",
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
      followerIdIdx: index("FollowUser_followerId_idx").on(table.followerId),
      followingIdIdx: index("FollowUser_followingId_idx").on(table.followingId),
      followUserFollowerIdFollowingId: primaryKey({
        columns: [table.followerId, table.followingId],
        name: "FollowUser_followerId_followingId",
      }),
    };
  }
);

export const list = mysqlTable(
  "List",
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
      userIdIdx: index("List_userId_idx").on(table.userId),
      listId: primaryKey({ columns: [table.id], name: "List_id" }),
    };
  }
);

export const requestResponse = mysqlTable(
  "RequestResponse",
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
      requestResponseId: primaryKey({
        columns: [table.id],
        name: "RequestResponse_id",
      }),
    };
  }
);

export const user = mysqlTable(
  "User",
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
      userId: primaryKey({ columns: [table.id], name: "User_id" }),
      userUsernameKey: unique("User_username_key").on(table.username),
      userEmailKey: unique("User_email_key").on(table.email),
    };
  }
);

export const waitlist = mysqlTable(
  "Waitlist",
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
      waitlistId: primaryKey({ columns: [table.id], name: "Waitlist_id" }),
      waitlistEmailKey: unique("Waitlist_email_key").on(table.email),
    };
  }
);
