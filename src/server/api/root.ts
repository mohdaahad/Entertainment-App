import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/user";
import { bookmarkRouter } from "~/server/api/routers/bookmark";
import { reviewRouter } from "~/server/api/routers/review";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  bookmark: bookmarkRouter,
  review: reviewRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
