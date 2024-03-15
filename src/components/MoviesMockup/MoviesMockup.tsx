import { useThemeContext } from '~/contexts/useThemeContext';
import { ThemeType } from '~/types/ThemeType';

type Props = {
  title?: string;
};

export const MoviesMockup = ({ title }: Props) => {
  const { themeType } = useThemeContext();

  const bgColor = themeType === ThemeType.Dark ? 'bg-semi-dark' : 'bg-grey';

  return (
    <section className="mb-6 pb-8 sm:mb-10">
      {title && (
        <h2 className="mb-6 text-xl font-light sm:text-[32px] lg:mb-10">
          {title}
        </h2>
      )}

      <div
        className="
          grid grid-cols-2 gap-4 sm:grid-cols-3 
          sm:gap-x-7 sm:gap-y-6 xl:grid-cols-4 xl:gap-x-10 xl:gap-y-8
        "
      >
        {[...Array(12).keys()].map((num) => (
          <div
            key={JSON.stringify(num)}
            className="min-w-[140px] sm:min-w-[180px] lg:min-w-[250px]"
          >
            <div
              id="image-container"
              className="relative mb-2 overflow-hidden rounded-lg pt-[56.25%]"
            >
              <div
                className={`${bgColor} absolute bottom-[1px] left-[1px] right-[1px] top-[1px] animate-pulse`}
              />
            </div>

            <div
              className={`${bgColor} mb-1 h-[14px] w-3/4 animate-pulse rounded-sm sm:h-4`}
            />

            <div
              className={`${bgColor} h-[18px] w-2/4 animate-pulse rounded-sm sm:h-6`}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
