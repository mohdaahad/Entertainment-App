import { z } from 'zod';
import { MoviesSchema } from './Movie';

export const MoviesAPIResponse = z.object({
  page: z.number(),
  results: MoviesSchema,
  total_results: z.number().optional(),
});

export const VideoSchema = z.object({
  key: z.string(),
  site: z.string(),
  type: z.string(),
});

export const VideosSchema = z.array(VideoSchema);

export const VideosAPIResponse = z.object({
  id: z.number(),
  results: VideosSchema,
});

export const ImageSchema = z.object({
  file_path: z.string(),
});
export const ImagesSchema = z.array(ImageSchema);

export const ImagesAPIResponse = z.object({
  backdrops: ImagesSchema,
});

export const SearchAPIResponse = z.object({
  total: z.number(),
  results: MoviesSchema,
});

export type MoviesAPIResponseType = z.infer<typeof MoviesAPIResponse>;
export type VideoType = z.infer<typeof VideoSchema>;
export type VideosAPIResponseType = z.infer<typeof VideosAPIResponse>;
export type ImageType = z.infer<typeof ImageSchema>;
export type ImagesAPIResponseType = z.infer<typeof ImagesAPIResponse>;
export type SearchAPIResponseType = z.infer<typeof SearchAPIResponse>;
