import classNames from 'classnames';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useThemeContext } from '~/contexts/useThemeContext';
import { ThemeType } from '~/types/ThemeType';
import { IconName, getIconByName } from '~/utils/getIconByName';
import { SvgIcon } from '~/components/SvgIcon';

type Props = {
  imagesPaths: string[];
};

export const MovieSlider = ({ imagesPaths }: Props) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { themeType } = useThemeContext();

  const setSlideTo0 = () => {
    setCurrentSlide(0);
  };

  const intervalId = useRef<NodeJS.Timer>();

  useEffect(() => {
    window.addEventListener('resize', setSlideTo0);
    intervalId.current = setInterval(handleSlideRight, 10000);

    return () => {
      window.removeEventListener('resize', setSlideTo0);
      clearInterval(intervalId.current);
    };
  }, []);

  const lastIndex = imagesPaths.length - 1;
  const slideRef = useRef<HTMLDivElement>(null);

  const handleSlideRight = () => {
    setCurrentSlide((prev) => (prev === lastIndex ? 0 : prev + 1));
  };

  const handleSlideLeft = () => {
    setCurrentSlide((prev) => (prev === 0 ? lastIndex : prev - 1));
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      handleSlideRight();
      clearInterval(intervalId.current);
    },
    onSwipedRight: () => {
      handleSlideLeft();
      clearInterval(intervalId.current);
    },
    delta: 10,
    swipeDuration: 1000,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const width = slideRef.current?.clientWidth || 0;
  const translateWidth = currentSlide * width;
  const hasOneImage = imagesPaths.length <= 1;
  const placeholderBgColor =
    themeType === ThemeType.Dark ? 'bg-semi-dark' : 'bg-grey';

  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 top-0 rounded-lg">
        <div className="select-none rounded-lg pt-[56.25%]" {...handlers}>
          <div
            ref={slideRef}
            className="absolute bottom-0 left-0 right-0 top-0 flex transition duration-500"
            style={{
              transform: `translateX(-${translateWidth}px)`,
            }}
          >
            <div
              className={`${placeholderBgColor} absolute bottom-[1px] left-[1px] right-[1px] top-[1px] animate-pulse transition-colors duration-500`}
            />

            {imagesPaths &&
              imagesPaths.map((path) => (
                <div key={path} className="relative min-h-full min-w-full">
                  <picture>
                    <source
                      media="(max-width: 500px)"
                      srcSet={`https://www.themoviedb.org/t/p/w780${path}`}
                    />
                    <source
                      media="(max-width: 1023px)"
                      srcSet={`https://www.themoviedb.org/t/p/w1280${path}`}
                    />
                    <img
                      className="m-auto h-full object-contain transition-all duration-1000"
                      alt="movie image"
                      src={`https://www.themoviedb.org/t/p/original${path}`}
                    />
                  </picture>
                </div>
              ))}
          </div>

          <div
            className={`absolute bottom-0 left-0 right-0 top-0 rounded-lg border-2 ${
              themeType === ThemeType.Dark ? 'border-dark' : 'border-light'
            }`}
          />
        </div>

        {!hasOneImage && (
          <>
            <button
              className={classNames(
                'absolute bottom-0 left-0 top-0 hidden w-1/2 items-center justify-start bg-gradient-to-r to-0% p-10 text-light opacity-0 transition duration-500 hover:opacity-100 sm:flex',
                {
                  'from-light': themeType === ThemeType.Light,
                },
                {
                  'from-dark': themeType === ThemeType.Dark,
                },
              )}
              onClick={handleSlideLeft}
            >
              <SvgIcon
                className={classNames(
                  'h-10 w-10 -rotate-90',
                  {
                    'fill-light': themeType === ThemeType.Dark,
                  },
                  {
                    'fill-semi-dark': themeType === ThemeType.Light,
                  },
                )}
                viewBox="5 5 38 38"
              >
                {getIconByName(IconName.ARROW_UP)}
              </SvgIcon>
            </button>

            <button
              className={classNames(
                'absolute bottom-0 right-0 top-0 hidden w-1/2 items-center justify-end bg-gradient-to-l to-0% p-10 opacity-0 transition duration-500 hover:opacity-100 sm:flex',
                {
                  'from-light': themeType === ThemeType.Light,
                },
                {
                  'from-dark': themeType === ThemeType.Dark,
                },
              )}
              onClick={handleSlideRight}
            >
              <SvgIcon
                className={classNames(
                  'h-10 w-10 rotate-90',
                  {
                    'fill-light': themeType === ThemeType.Dark,
                  },
                  {
                    'fill-semi-dark': themeType === ThemeType.Light,
                  },
                )}
                viewBox="5 5 38 38"
              >
                {getIconByName(IconName.ARROW_UP)}
              </SvgIcon>
            </button>
          </>
        )}
      </div>

      {!hasOneImage && (
        <div
          className={classNames(
            'absolute bottom-0 left-0 right-0 hidden items-center justify-center gap-2 bg-gradient-to-t to-10% pb-1 opacity-100 sm:flex',
            {
              'from-light': themeType === ThemeType.Light,
            },
            {
              'from-dark': themeType === ThemeType.Dark,
            },
          )}
        >
          {imagesPaths.map((path, index) => (
            <button
              key={path}
              className={classNames(
                'relative h-10 w-20 border-none transition-transform',
                {
                  '-translate-y-1 scale-110': currentSlide === index,
                },
              )}
              onClick={() => setCurrentSlide(index)}
            >
              <Image
                className="object-cover, rounded-lg"
                alt="movie image"
                fill
                priority
                sizes="(max-width: 640px) 50vw, 33vw"
                src={`https://www.themoviedb.org/t/p/w300${path}`}
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
};
