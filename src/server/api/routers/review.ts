import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const reviewRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ movieId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.review.findMany({
        where: {
          movieId: input.movieId,
        },
        orderBy: {
          createdAt: 'desc',
        }
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        movieId: z.number(),
        rating: z.number(),
        text: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.review.create({
        data: {
          movieId: input.movieId,
          text: input.text,
          rating: input.rating,
          userId: ctx.session.user.id,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.review.delete({
        where: {
          id: input.id,
        },
      });
    }),

    change: protectedProcedure
      .input(
        z.object({ 
          id: z.string(), 
          text: z.string(), 
          rating: z.number() 
        })
      )
      .mutation(({ ctx, input }) => {
        return ctx.prisma.review.update({
          data: {
            text: input.text,
            rating: input.rating,
          },
          where: {
            id: input.id,
          },
        });
      }),
});
