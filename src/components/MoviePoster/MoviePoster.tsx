import { type FC } from 'react';
import { useThemeContext } from '~/contexts/useThemeContext';
import { ThemeType } from '~/types/ThemeType';

type Props = {
  poster_path: string;
};

export const MoviePoster: FC<Props> = ({ poster_path }) => {
  const { themeType } = useThemeContext();

  const bgColor = themeType === ThemeType.Dark ? 'bg-semi-dark' : 'bg-grey';

  return (
    <div
      className={`${bgColor}
            absolute bottom-[1px] left-[1px] right-[1px] top-[1px]
            text-2xl 
          `}
    >
      {poster_path ? (
        <picture>
          <source
            media="(max-width: 799px)"
            srcSet={`https://www.themoviedb.org/t/p/w500${poster_path}`}
          />
          <source
            media="(max-width: 1023px)"
            srcSet={`https://www.themoviedb.org/t/p/w780${poster_path}`}
          />
          <img
            className="m-auto h-full object-contain transition-all duration-1000"
            alt="movie image"
            src={`https://www.themoviedb.org/t/p/original${poster_path}`}
          />
        </picture>
      ) : (
        <p>No image</p>
      )}
    </div>
  );
};
