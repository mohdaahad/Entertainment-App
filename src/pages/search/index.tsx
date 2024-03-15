import { useQuery } from '@tanstack/react-query';
import { uniqBy } from 'lodash';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Loader } from '~/components/Loader';
import { Movies } from '~/components/Movies';
import { MoviesMockup } from '~/components/MoviesMockup';
import { MovieDB } from '~/controllers/movieDB';
import { type SearchAPIResponseType } from '~/types/responses';

const defaultResults: SearchAPIResponseType = {
  results: [],
  total: 0,
};

const SearchPage = () => {
  const page = useRef(1);
  const { query } = useRouter();
  const [results, setResults] = useState(defaultResults);
  const [isLoaded, setLoaded] = useState(false);
  const attempsWithoutResult = useRef(0);

  const queryParams = Array.isArray(query.params)
    ? query.params[0]
    : query.params;

  const { isError, refetch, isFetching } = useQuery({
    queryKey: ['movies'],
    queryFn: () => {
      return MovieDB.getInstance().getSearchResult(
        queryParams || '',
        page.current,
      );
    },
    onSuccess(data) {
      setResults((prev) => {
        if (!data.results.length) {
          attempsWithoutResult.current += 1;
        }

        return {
          results: uniqBy(
            [...prev.results, ...data.results],
            (elem) => elem.id,
          ),
          total: data.total,
        };
      });
      page.current += 1;
    },
    enabled: false,
  });

  const loadMoreResults = useCallback(async () => {
    if (attempsWithoutResult.current <= 5) {
      await refetch();
    }
  }, [refetch]);

  const loadFirstResults = async (queryParams = '') => {
    const getResultsFromServer = async (attempt = 1): Promise<void> => {
      if (attempt > 1) {
        return;
      }

      const resultsFromServer = await MovieDB.getInstance().getSearchResult(
        queryParams,
        1,
      );

      if (resultsFromServer.results.length) {
        setResults(resultsFromServer);
        return;
      } else {
        return await getResultsFromServer(attempt + 1);
      }
    };

    await getResultsFromServer();
    setLoaded(true);
  };

  useEffect(() => {
    setLoaded(false);

    page.current = 1;
    attempsWithoutResult.current = 0;

    setResults(defaultResults);
    void loadFirstResults(queryParams);
  }, [queryParams]);

  useEffect(() => {
    const loadNewMovies = () => {
      const { clientHeight, scrollHeight, scrollTop } =
        document.documentElement;

      const needLoad = scrollHeight - clientHeight - scrollTop < 1000;

      if (needLoad) {
        void loadMoreResults();
      }
    };

    window.addEventListener('scroll', loadNewMovies);

    return () => {
      window.removeEventListener('scroll', loadNewMovies);
    };
  }, [loadMoreResults]);

  const titleIfFound = `Found ${results?.total || 0} results for '${
    queryParams || 'your request'
  }'`;

  const title = !isLoaded ? 'Searching for results...' : titleIfFound;

  return (
    <>
      {!isLoaded ? (
        <MoviesMockup title={title} />
      ) : (
        <>
          <Movies
            movies={results?.results || []}
            title={isError ? 'Something went wrong.' : title}
          />
          {isFetching && (
            <div className="relative h-10">
              <Loader />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default SearchPage;
