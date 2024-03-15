import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback,useEffect,useState } from 'react';
import { BookmarkButton } from '~/components/Buttons/BookmarkButton';
import { TrailerButton } from '~/components/Buttons/TrailerButton';
import { Details } from '~/components/Details';
import { Loader } from '~/components/Loader';
import { MovieInfo } from '~/components/MovieInfo';
import { MoviePoster } from '~/components/MoviePoster';
import { MovieSlider } from '~/components/MovieSlider';
import { MovieTrailerPopup } from '~/components/MovieTrailerPopup';
import { Reviews } from '~/components/Reviews';
import { useBookmarksContext } from '~/contexts/useBookmarksContext';
import { useThemeContext } from '~/contexts/useThemeContext';
import { MovieDB } from '~/controllers/movieDB';
import { Category } from '~/types/Category.enum';
import { type MovieType } from '~/types/Movie';
import { ThemeType } from '~/types/ThemeType';
import { api } from '~/utils/api';
import { IconName } from '~/utils/getIconByName';

const MoviePage = () => {
  const { query } = useRouter();
  const movieId = query.movieId ? Number(query.movieId) : 0;
  const [movie, setMovie] = useState<MovieType | null>(null);
  const [isPlayerOpened, setPlayerOpened] = useState(false);
  const { themeType } = useThemeContext();

  const movieQuery = useQuery({
    queryKey: [`${movieId}-tv`],
    queryFn: () => MovieDB.getInstance().getMovie(movieId, Category.MOVIE),
    onSuccess: (data) => setMovie(data),
  });

  const trailerKeyQuery = useQuery({
    queryKey: [`${movieId}-trailerKey`],
    queryFn: () => MovieDB.getInstance().getTrailerKey(movieId, Category.MOVIE),
    enabled: movieId !== 0,
  });

  const moreImagesQuery = useQuery({
    queryKey: [`${movieId}-images`],
    queryFn: () => MovieDB.getInstance().getImages(movieId, Category.MOVIE),
    enabled: movieId !== 0,
  });

  const { data: sessionData } = useSession();
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const {
    currentId,
    bookmarks,
    isInBookmarks,
    addToBookmarks,
    deleteFromBookmarks,
  } = useBookmarksContext();

  const { data: reviews = [] } = api.review.getAll.useQuery({ movieId });

  useEffect(() => {
    setIsBookmarked(isInBookmarks(movieId));
  }, [bookmarks, movieId, isInBookmarks]);

  const handleBookmarkClick = () => {
    if (sessionData?.user) {
      if (isBookmarked) {
        deleteFromBookmarks(movieId);
      } else {
        addToBookmarks(movieId, Category.MOVIE);
      }
    } else {
      void router.push('/auth/signin');
    }
  };

  const handlePopup = useCallback(() => {
    setPlayerOpened((prev) => !prev);
  }, []);

  const date = movie?.release_date
    ? movie.release_date.slice(0, 4)
    : 'No release date';

  const rating =
    reviews.reduce((acc, review) => {
      return acc + review.rating;
    }, 0) / reviews.length || 0;

  return (
    <>
      {!movieQuery.isError && movie ? (
        <section>
          <h1
            className={`mb-2 text-xl font-light sm:mb-4 sm:text-3xl
          ${themeType === ThemeType.Dark ? 'text-light' : 'text-dark'}`}
          >
            {movie.title}
          </h1>

          <div className="mb-2">
            <Details year={date} icon={IconName.MOVIE} />
          </div>

          <div className="grid gap-x-12 lg:grid-cols-3">
            <div className="relative mb-8 overflow-hidden rounded-xl pt-[56.25%] lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-2">
              {moreImagesQuery?.data?.length !== 0 && !moreImagesQuery.isError ? (
                <MovieSlider imagesPaths={...moreImagesQuery.data ?? []} />
              ) : (
                <MoviePoster poster_path={movie.poster_path} />
              )}
            </div>

            <div className="mb-10 max-w-2xl lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-7 lg:mb-0">
              <div
                className="
                    mb-8 flex flex-col flex-wrap items-center
                    justify-between gap-[4%] gap-y-3 sm:flex-row
                  "
              >
                <BookmarkButton
                  isBookmarked={isBookmarked}
                  handleBookmarkClick={handleBookmarkClick}
                  currentId={currentId}
                  movieId={movieId}
                />

                {trailerKeyQuery.data && (
                  <TrailerButton handlePopup={handlePopup} />
                )}
              </div>

              <MovieInfo
                movie={movie}
                category={Category.MOVIE}
                rating={rating}
              />
            </div>

            <div className="lg:col-start-1 lg:col-end-3 lg:row-start-2 lg:row-end-3">
              <Reviews reviews={reviews} movieId={movieId} />
            </div>
          </div>

          {isPlayerOpened && (
            <MovieTrailerPopup
              trailerKey={trailerKeyQuery.data ?? ''}
              onClose={handlePopup}
            />
          )}
        </section>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default MoviePage;
