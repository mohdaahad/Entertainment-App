import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, type FC } from 'react';
import { useBookmarksContext } from '~/contexts/useBookmarksContext';
import { useThemeContext } from '~/contexts/useThemeContext';
import { Category } from '~/types/Category.enum';
import { ThemeType } from '~/types/ThemeType';
import { IconName, getIconByName } from '~/utils/getIconByName';
import { Details } from '../../Details';
import { SvgIcon } from '../../SvgIcon/SvgIcon';

type Props = {
  movieId?: number;
  imagePath?: string;
  title?: string;
  releaseDate?: string;
  categoryIcon?: IconName;
  category?: Category;
  language?: string;
  rating?: number;
  isBookmarkedInitial?: boolean;
  onBookmarksAdd?: (id: number, type: Category) => void;
  onBookmarksRemove?: (id: number) => void;
};

export const TrendingCard: FC<Props> = ({
  movieId = 0,
  imagePath = '',
  title = '',
  releaseDate = '',
  categoryIcon = IconName.NONE,
  category = Category.MOVIE,
  language,
  rating,
  isBookmarkedInitial,
  onBookmarksAdd,
  onBookmarksRemove,
}) => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const { themeType } = useThemeContext();

  const [isBookmarked, setIsBookmarked] = useState(isBookmarkedInitial);
  const { currentId, bookmarks, isInBookmarks } = useBookmarksContext();

  useEffect(() => {
    setIsBookmarked(isInBookmarks(movieId));
  }, [bookmarks]);

  const handleBookmarkClick = () => {
    if (
      sessionData?.user &&
      currentId !== movieId &&
      onBookmarksAdd &&
      onBookmarksRemove
    ) {
      if (isBookmarked) {
        onBookmarksRemove(movieId);
        setIsBookmarked(false);
      } else {
        onBookmarksAdd(movieId, category);
        setIsBookmarked(true);
      }
    } else {
      void router.push('/auth/signin');
    }
  };

  const bgColor = themeType === ThemeType.Dark ? 'bg-semi-dark' : 'bg-grey';

  if (!movieId) {
    return (
      <div className="min-w-[230px] snap-start sm:min-w-[410px] lg:min-w-[470px]">
        <div className="relative overflow-hidden rounded-lg pt-[50%]">
          <div
            className={`${bgColor} absolute bottom-0 left-0 right-0 top-0 animate-pulse`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-w-[230px] snap-start sm:min-w-[410px] lg:min-w-[470px]">
      <Link
        href={
          category === Category.MOVIE ? `/movie/${movieId}` : `/tv/${movieId}`
        }
        className="min-w-[230px] snap-start sm:min-w-[410px] lg:min-w-[470px]"
      >
        <div className="relative overflow-hidden rounded-lg pt-[50%]">
          <>
            <Image
              className="object-cover duration-1000 hover:scale-110"
              alt="movie image"
              fill
              priority
              sizes="(max-width: 640px) 50vw, 33vw"
              src={`https://www.themoviedb.org/t/p/w780${imagePath}`}
            />

            <div className="absolute bottom-2 left-2 rounded-md bg-dark bg-opacity-50 p-2">
              <Details
                year={releaseDate ? releaseDate.slice(0, 4) : ''}
                icon={categoryIcon}
                language={language}
                rating={rating}
                textColor={'light'}
              />

              <h3 className="text-sm font-medium leading-[18px] text-light sm:text-lg sm:leading-6">
                {title}
              </h3>
            </div>
          </>
        </div>
      </Link>

      <div
        className={classNames(
          'hover: absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-dark bg-opacity-50 opacity-100 transition hover:bg-light  sm:right-4 sm:top-4',
          {
            'pointer-events-none opacity-25': currentId === movieId,
          },
        )}
      >
        <button onClick={handleBookmarkClick}>
          <SvgIcon
            className={classNames(
              'h-[32px] w-[32px] cursor-pointer fill-none stroke-light stroke-[1.5] hover:stroke-dark active:fill-light',
              {
                'fill-primary stroke-primary hover:stroke-primary':
                  isBookmarked,
              },
            )}
            viewBox="-10 -9 38 38"
          >
            {getIconByName(IconName.BOOKMARK)}
          </SvgIcon>
        </button>
      </div>
    </div>
  );
};
