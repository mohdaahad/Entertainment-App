import { z } from "zod";

export const MovieSchema = z.object({
  id: z.number(),
  media_type: z.string().optional(),
  title: z.string().optional(),
  name: z.string().optional(),
  poster_path: z.string(),
  backdrop_path: z.string().nullable(),
  release_date: z.string().optional(),
  first_air_date: z.string().optional(),
  overview: z.string(),
  vote_average: z.number(),
  vote_count: z.number(),
  popularity: z.number(),
  original_language: z.string(),
  original_title: z.string(),
  genres: z.array(z.object({
    name: z.string(),
  })),
  video: z.boolean(),
  adult: z.boolean(),
  video_id: z.string().optional(),
  status: z.string(),
  runtime: z.number(),
  origin_country: z.array(z.string()).optional(),
  seasons: z.array(z.object({
    air_date: z.string(),
    episode_count: z.number(),
    name: z.string(),
    id: z.number(),
  })).optional(),
});
export const MoviesSchema = z.array(MovieSchema);

export type MoviesType = z.infer<typeof MoviesSchema>;
export type MovieType = z.infer<typeof MovieSchema>;
