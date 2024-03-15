import { type FC } from 'react';
import { SvgIcon } from '~/components/SvgIcon';
import { IconName, getIconByName } from '~/utils/getIconByName';

type Props = {
  isBookmarked: boolean;
  handleBookmarkClick: () => void;
  currentId: number | null;
  movieId: number;
};

export const BookmarkButton: FC<Props> = ({
  isBookmarked,
  handleBookmarkClick,
  currentId,
  movieId,
}) => {
  return (
    <button
      className="
        text-md relative flex h-10 w-full items-center justify-center gap-2
        rounded-lg bg-primary bg-opacity-75 text-light transition hover:bg-opacity-100
        sm:w-[48%] lg:w-full xl:w-[48%]
        "
      onClick={handleBookmarkClick}
      disabled={currentId === movieId}
    >
      {currentId === movieId ? (
        <>
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-light border-b-primary"></div>
        </>
      ) : (
        <>
          <SvgIcon
            className={`h-[32px] w-[32px] cursor-pointer  stroke-light stroke-[1.5] 
              ${isBookmarked ? 'fill-light' : 'fill-none'}`}
            viewBox="-10 -9 38 38"
          >
            {getIconByName(IconName.BOOKMARK)}
          </SvgIcon>
          {isBookmarked ? 'Іn bookmarks' : 'Bookmark'}
        </>
      )}
    </button>
  );
};
