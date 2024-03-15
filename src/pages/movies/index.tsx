import { useQuery } from '@tanstack/react-query';
import { uniqBy } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Movies } from '~/components/Movies';
import { MoviesMockup } from '~/components/MoviesMockup';
import { MovieDB } from '~/controllers/movieDB';
import { Category } from '~/types/Category.enum';
import { type MoviesType } from '~/types/Movie';

const MoviesPage = () => {
  const page = useRef(1);
  const [movies, setMovies] = useState<MoviesType>([]);

  const { isError, refetch, isFetching } = useQuery({
    queryKey: ['movies'],
    queryFn: () =>
      MovieDB.getInstance().getPopular(page.current, Category.MOVIE),
    onSuccess(data) {
      setMovies((prev) => {
        return uniqBy([...prev, ...data], (elem) => elem.id);
      });
      page.current += 1;
    },
  });

  const loadMoreMovies = useCallback(async () => {
    await refetch();
  }, [refetch]);

  useEffect(() => {
    const loadNewMovies = () => {
      const { clientHeight, scrollHeight, scrollTop } =
        document.documentElement;

      const needLoad = scrollHeight - clientHeight - scrollTop < 1000;

      if (needLoad) {
        void loadMoreMovies();
      }
    };

    window.addEventListener('scroll', loadNewMovies);

    return () => {
      window.removeEventListener('scroll', loadNewMovies);
    };
  }, [loadMoreMovies]);

  return isFetching && movies.length < 1 ? (
    <MoviesMockup title="Popular movies" />
  ) : (
    <Movies
      movies={isError ? [] : movies}
      title={isError ? 'Error! No movies loaded :(' : 'Popular movies'}
      category={Category.MOVIE}
    />
  );
};

export default MoviesPage;
