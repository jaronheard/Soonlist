import { InferSelectModel } from "drizzle-orm";
import { comments } from "./schema";
import { events } from "./schema";
import { eventFollows } from "./schema";
import { listFollows } from "./schema";
import { userFollows } from "./schema";
import { lists } from "./schema";
import { requestResponses } from "./schema";
import { users } from "./schema";

export type Comment = InferSelectModel<typeof comments>;
export type Event = InferSelectModel<typeof events>;
export type EventFollow = InferSelectModel<typeof eventFollows>;
export type ListFollow = InferSelectModel<typeof listFollows>;
export type UserFollow = InferSelectModel<typeof userFollows>;
export type List = InferSelectModel<typeof lists>;
export type RequestResponse = InferSelectModel<typeof requestResponses>;
export type User = InferSelectModel<typeof users>;
