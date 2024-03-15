import { type FC } from 'react';
import { SvgIcon } from '~/components/SvgIcon';
import { useThemeContext } from '~/contexts/useThemeContext';
import { ThemeType } from '~/types/ThemeType';
import { IconName, getIconByName } from '~/utils/getIconByName';
import { Rating } from '../Rating';
import { Separator } from './components/Separator';

type Props = {
  year?: string;
  icon: IconName;
  language?: string;
  rating?: number;
  textColor?: 'dark' | 'light';
};

export const Details: FC<Props> = ({
  year,
  icon,
  language,
  rating,
  textColor,
}) => {
  const { themeType } = useThemeContext();

  let isColorDark = themeType === ThemeType.Light;

  if (textColor) {
    isColorDark = textColor === 'dark';
  }

  return (
    <div
      className={`mb-1 flex gap-1 text-[11px] font-light leading-[14px] opacity-75 min-[370px]:gap-1.5  sm:text-[13px] sm:leading-4 ${
        isColorDark ? 'text-dark' : 'text-light'
      }`}
    >
      {year && (
        <>
          <p>{year}</p>

          <Separator />
        </>
      )}

      <div className="flex items-center gap-1">
        <SvgIcon
          className={`h-2.5 w-2.5  ${isColorDark ? 'fill-dark' : 'fill-light'}`}
        >
          {getIconByName(icon)}
        </SvgIcon>

        <p>{icon === IconName.MOVIE ? 'Movie' : 'Serie'}</p>
      </div>

      {language && (
        <>
          <Separator />
          <p>{language.toUpperCase()}</p>{' '}
        </>
      )}

      {rating && (
        <>
          <Separator />

          <Rating average={rating} />
        </>
      )}
    </div>
  );
};
