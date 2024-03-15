import { useQuery } from '@tanstack/react-query';
import { uniqBy } from 'lodash';
import { useCallback, useEffect,useRef,useState } from 'react';
import { Movies } from '~/components/Movies';
import { MoviesMockup } from '~/components/MoviesMockup';
import { MovieDB } from '~/controllers/movieDB';
import { Category } from '~/types/Category.enum';
import { type MoviesType } from '~/types/Movie';

const SeriesPage = () => {
  const page = useRef(1);
  const [series, setSeries] = useState<MoviesType>([]);

  const { isFetching, isError, refetch } = useQuery({
    queryKey: ['series'],
    queryFn: () => MovieDB.getInstance().getPopular(page.current, Category.TV),
    onSuccess(data) {
      setSeries((prev) => {
        return uniqBy([...prev, ...data], (elem) => elem.id);
      });
      page.current += 1;
    },
  });

  const loadMoreSeries = useCallback(async () => {
    await refetch();
  }, [refetch]);

  useEffect(() => {
    const loadNewMovies = () => {
      const { clientHeight, scrollHeight, scrollTop } =
        document.documentElement;

      const needLoad = scrollHeight - clientHeight - scrollTop < 1000;

      if (needLoad) {
        void loadMoreSeries();
      }
    };

    window.addEventListener('scroll', loadNewMovies);

    return () => {
      window.removeEventListener('scroll', loadNewMovies);
    };
  }, [loadMoreSeries]);

  return isFetching && series.length < 1 ? (
    <MoviesMockup title="Popular series" />
  ) : (
    <Movies
      movies={isError ? [] : series}
      title={isError ? 'Error! No series loaded :(' : 'Popular series'}
      category={Category.TV}
    />
  );
};

export default SeriesPage;
