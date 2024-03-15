import { env } from '~/env.mjs';
import { Category } from '~/types/Category.enum';
import { type MovieType } from '~/types/Movie';
import {
  type ImagesAPIResponseType,
  type MoviesAPIResponseType,
  type SearchAPIResponseType,
  type VideosAPIResponseType,
} from '~/types/responses';
import { get } from '~/utils/helpers';

export class MovieDB {
  private static instance: MovieDB;

  static getInstance() {
    if (!MovieDB.instance) {
      MovieDB.instance = new MovieDB();
    }

    return MovieDB.instance;
  }

  public getMovie = async (id: number, category: Category = Category.MOVIE) => {
    const data = await get<MovieType>(
      `${env.NEXT_PUBLIC_TMDB_MOVIE_URL}/${category}/${id}?${env.NEXT_PUBLIC_TMDB_API_KEY}`,
    );

    return data;
  };

  public getImages = async (
    id: number,
    category: Category = Category.MOVIE,
  ) => {
    const { backdrops } = await get<ImagesAPIResponseType>(
      `${env.NEXT_PUBLIC_TMDB_MOVIE_URL}/${category}/${id}/images?${env.NEXT_PUBLIC_TMDB_API_KEY}&include_image_language=null`,
    );

    if (backdrops.length > 5) {
      return backdrops.slice(0, 5).map(({ file_path }) => file_path);
    }

    return backdrops.map(({ file_path }) => file_path) || [];
  };

  public getTrailerKey = async (
    id: number,
    category: Category = Category.MOVIE,
  ) => {
    const { results } = await get<VideosAPIResponseType>(
      `${env.NEXT_PUBLIC_TMDB_MOVIE_URL}/${category}/${id}/videos?${env.NEXT_PUBLIC_TMDB_API_KEY}`,
    );
    const trailer = results.find(
      ({ site, type }) => site === 'YouTube' && type === 'Trailer',
    );

    return trailer ? trailer.key : '';
  };

  public getPopular = async (
    page: number,
    category: Category = Category.MOVIE,
  ) => {
    const { results } = await get<MoviesAPIResponseType>(
      `${env.NEXT_PUBLIC_TMDB_MOVIE_URL}/${category}/popular?${env.NEXT_PUBLIC_TMDB_API_KEY}&page=${page}`,
    );

    return results;
  };

  public getTrending = async (category: Category = Category.MOVIE) => {
    const { results } = await get<MoviesAPIResponseType>(
      `${env.NEXT_PUBLIC_TMDB_MOVIE_URL}/trending/${category}/week?${env.NEXT_PUBLIC_TMDB_API_KEY}`,
    );

    return results;
  };

  public getSearchResult = async (
    query: string,
    page = 1,
  ): Promise<SearchAPIResponseType> => {
    const { results: moviesResults, total_results: totalMovies = 0 } =
      await get<MoviesAPIResponseType>(
        `${env.NEXT_PUBLIC_TMDB_MOVIE_URL}/search/movie?${env.NEXT_PUBLIC_TMDB_API_KEY}&query=${query}&page=${page}`,
      );
    const { results: seriesResults, total_results: totalSeries = 0 } =
      await get<MoviesAPIResponseType>(
        `${env.NEXT_PUBLIC_TMDB_MOVIE_URL}/search/tv?${env.NEXT_PUBLIC_TMDB_API_KEY}&query=${query}&page=${page}`,
      );

    const movies = moviesResults.map((movie) => ({
      ...movie,
      media_type: 'movie',
    }));
    const series = seriesResults.map((serie) => ({
      ...serie,
      media_type: 'tv',
    }));

    const results = movies
      .concat(series)
      .sort((a, b) => b.vote_count - a.vote_count);

    return {
      results: results,
      total: totalMovies + totalSeries,
    };
  };
}
