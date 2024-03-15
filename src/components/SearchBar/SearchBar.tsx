import classNames from 'classnames';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { SvgIcon } from '~/components/SvgIcon';
import { useThemeContext } from '~/contexts/useThemeContext';
import { ThemeType } from '~/types/ThemeType';
import { IconName, getIconByName } from '~/utils/getIconByName';

export const SearchBar = () => {
  const [currentQuery, setCurrentQuery] = useState('');
  const router = useRouter();
  const { themeType } = useThemeContext();
  const initialQueryLoaded = useRef(false);
  const lastPage = useRef('/');

  const handleRequest = (param: string) => {
    if (!param) {
      void router.push(lastPage.current);
    } else {
      void router.push(`/search?params=${param}`);
    }
  };

  const debouncedRequest = useRef(_.debounce(handleRequest, 700)).current;

  const handleChangeQuery = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentQuery(event.target.value);

    if (!router.asPath.includes('/search')) {
      lastPage.current = router.asPath;
    }

    debouncedRequest.cancel();

    debouncedRequest(event.target.value);
  };

  useEffect(() => {
    if (!router.asPath.includes('/search')) {
      setCurrentQuery('');
    }

    if (!initialQueryLoaded.current) {
      const query = router.query.params;

      if (query) {
        setCurrentQuery(JSON.stringify(query).slice(1, -1));

        initialQueryLoaded.current = true;
      }
    }
  }, [router]);

  return (
    <form
      action="get"
      onSubmit={(event) => {
        event.preventDefault();
        handleRequest(currentQuery);
      }}
    >
      <label
        className="
        flex cursor-text items-center 
        gap-4
        py-4 sm:mb-6 sm:gap-6 sm:py-2
        sm:text-2xl 
        lg:pt-16
      "
      >
        <SvgIcon
          className={classNames('h-6 w-6 sm:h-8 sm:w-8', {
            'fill-light': themeType === ThemeType.Dark,
          })}
          viewBox="0 0 24 24"
        >
          {getIconByName(IconName.SEARCH)}
        </SvgIcon>

        <input
          type="text"
          placeholder="Search for movies or TV series"
          value={currentQuery}
          onChange={handleChangeQuery}
          className={classNames(
            'w-full border-b border-opacity-0 p-2 font-light placeholder-dark caret-primary outline-none  placeholder:opacity-50 focus:border-b-grey',
            {
              'border-b-light bg-light text-dark placeholder:text-dark':
                themeType === ThemeType.Light,
            },
            {
              'border-b-dark bg-dark text-light placeholder:text-light':
                themeType === ThemeType.Dark,
            },
          )}
        />
      </label>
    </form>
  );
};
