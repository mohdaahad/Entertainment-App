import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const bookmarkRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ movieId: z.number(), type: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.bookmark.create({
        data: {
          movieId: input.movieId,
          type: input.type,
          userId: ctx.session.user.id,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ movieId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userBookmarks = await ctx.prisma.bookmark.findMany({
        where: {
          userId: ctx.session.user.id,
        }
      });

      const bookmarkToDelete = userBookmarks.find((bookmark) => {
        return bookmark.userId === ctx.session.user.id && bookmark.movieId === input.movieId;
      });

      if (bookmarkToDelete) {

        return ctx.prisma.bookmark.delete({
          where: {
            id: bookmarkToDelete.id,
          },
        });
      }
    }),

  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.prisma.bookmark.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });
    }),
});
