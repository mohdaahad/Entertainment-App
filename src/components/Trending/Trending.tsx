import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import _ from 'lodash';
import { useEffect, useMemo, useRef } from 'react';
import { useBookmarksContext } from '~/contexts/useBookmarksContext';
import { useThemeContext } from '~/contexts/useThemeContext';
import { MovieDB } from '~/controllers/movieDB';
import { Category } from '~/types/Category.enum';
import { type MovieType, type MoviesType } from '~/types/Movie';
import { ThemeType } from '~/types/ThemeType';
import { type IconName } from '~/utils/getIconByName';
import { TrendingCard } from './components/TrendingCard';

export const Trending = () => {
  const { themeType } = useThemeContext();

  const trendingMoviesQuery = useQuery({
    queryKey: ['trendingMovies'],
    queryFn: () => MovieDB.getInstance().getTrending(Category.MOVIE),
  });

  const trendingTVsQuery = useQuery({
    queryKey: ['trendingSeries'],
    queryFn: () => MovieDB.getInstance().getTrending(Category.TV),
  });

  const trendings: MoviesType | undefined = useMemo(() => {
    if (trendingMoviesQuery.data && trendingTVsQuery.data) {
      return _.shuffle<MovieType>([
        ...trendingMoviesQuery.data,
        ...trendingTVsQuery.data,
      ]);
    }
  }, [trendingMoviesQuery.data, trendingTVsQuery.data]);

  const { bookmarks, isInBookmarks, addToBookmarks, deleteFromBookmarks } =
    useBookmarksContext();

  const handleAddToBookmarks = (id: number, type: Category) => {
    addToBookmarks(id, type);
  };

  const handleRemoveFromBookmarks = (id: number) => {
    deleteFromBookmarks(id);
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const currentRef = scrollRef.current;
  const isScrolling = useRef(false);

  useEffect(() => {
    if (!currentRef) {
      return;
    }

    const scroll = () => {
      const { scrollLeft = 0, scrollWidth = 0, clientWidth = 0 } = currentRef;

      const isEnd = Math.abs(scrollWidth - clientWidth - scrollLeft) < 5;

      if (isEnd) {
        currentRef?.scrollTo({ left: 0, behavior: 'smooth' });
        return;
      }

      currentRef?.scrollBy({ left: clientWidth / 2, behavior: 'smooth' });
    };

    const slideTime = 10000;
    let slidingInterval = setInterval(scroll, slideTime);

    let timeout: NodeJS.Timer;

    const clearSlidingInterval = () => {
      clearTimeout(timeout);
      clearInterval(slidingInterval);
    };

    const setSlidingInterval = () => {
      timeout = setTimeout(() => {
        slidingInterval = setInterval(scroll, slideTime);
      }, slideTime);
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      const setTimer = (time = 500) => {
        setTimeout(() => (isScrolling.current = false), time);
      };

      if (isScrolling.current) return;

      isScrolling.current = true;

      const {
        scrollLeft = 0,
        scrollWidth = 0,
        clientWidth = 0,
        offsetWidth = 0,
      } = currentRef;

      const isEnd = Math.abs(scrollWidth - clientWidth - scrollLeft) < 5;
      const isStart = scrollLeft === 0;

      const delta = Math.max(-1, Math.min(1, event.deltaY || -event.detail));

      if (isEnd && delta === 1) {
        currentRef?.scrollTo({ left: 0, behavior: 'smooth' });

        setTimer(1000);
        return;
      }

      if (isStart && delta === -1) {
        currentRef?.scrollTo({
          left: Math.abs(scrollWidth - clientWidth - scrollLeft),
          behavior: 'smooth',
        });

        setTimer(1000);
        return;
      }

      currentRef?.scrollTo({
        left: scrollLeft + (delta * offsetWidth) / 2,
        behavior: 'smooth',
      });

      setTimer();
    };

    currentRef?.addEventListener('wheel', handleWheel, {
      passive: false,
    });
    currentRef?.addEventListener('mouseenter', clearSlidingInterval);
    currentRef?.addEventListener('mouseleave', setSlidingInterval);
    currentRef?.addEventListener('touchstart', clearSlidingInterval, {
      passive: true,
    });
    currentRef?.addEventListener('touchend', setSlidingInterval, {
      passive: true,
    });

    return () => {
      clearInterval(slidingInterval);
      currentRef?.removeEventListener('wheel', handleWheel);
      currentRef?.removeEventListener('mouseenter', clearSlidingInterval);
      currentRef?.removeEventListener('mouseleave', setSlidingInterval);
      currentRef?.removeEventListener('touchstart', clearSlidingInterval);
      currentRef?.removeEventListener('touchend', setSlidingInterval);
    };
  }, [currentRef]);

  return (
    <>
      {!trendingMoviesQuery.isError &&
        !trendingTVsQuery.isError &&
        trendings?.length && (
          <section className="relative mb-10 sm:mb-16 lg:pl-0">
            <h2 className="mb-6 text-xl font-light sm:text-[32px] lg:mb-10">
              Trending last week
            </h2>

            <div
              className="flex touch-pan-x snap-x snap-mandatory gap-4 overflow-x-scroll pb-2 sm:gap-10"
              ref={scrollRef}
            >
              {trendings.length > 0
                ? trendings.map((movie) => {
                    const {
                      id,
                      backdrop_path,
                      title,
                      name,
                      release_date,
                      first_air_date,
                      media_type,
                      original_language,
                      vote_average,
                    } = movie;
                    const isBookmarked = isInBookmarks(id);

                    const type = isBookmarked
                      ? bookmarks.find(({ movieId }) => movieId === id)?.type
                      : media_type;

                    return (
                      <TrendingCard
                        key={id}
                        movieId={id}
                        imagePath={backdrop_path || ''}
                        title={title || name}
                        releaseDate={release_date || first_air_date}
                        category={type as Category}
                        language={original_language}
                        rating={vote_average}
                        categoryIcon={type as IconName}
                        isBookmarkedInitial={isBookmarked}
                        onBookmarksAdd={handleAddToBookmarks}
                        onBookmarksRemove={handleRemoveFromBookmarks}
                      />
                    );
                  })
                : [null, null, null, null, null].map((_, index) => (
                    <TrendingCard key={index} />
                  ))}
            </div>

            <div
              className={classNames(
                'pointer-events-none absolute bottom-4 right-0 top-0 w-28 bg-gradient-to-l to-0%',
                { 'from-light': themeType === ThemeType.Light },
                { 'from-dark': themeType === ThemeType.Dark },
              )}
            />
          </section>
        )}
    </>
  );
};
