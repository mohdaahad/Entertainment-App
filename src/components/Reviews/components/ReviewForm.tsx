import { type Review } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState,type Dispatch,type FC,type SetStateAction } from 'react';
import { useThemeContext } from '~/contexts/useThemeContext';
import { ThemeType } from '~/types/ThemeType';
import { api } from '~/utils/api';

type Props = {
  movieId: number;
  setTempReview: Dispatch<SetStateAction<Review | null>>;
};

export const ReviewForm: FC<Props> = ({ movieId, setTempReview }) => {
  const [query, setQuery] = useState('');
  const [rate, setRate] = useState<number | string>('Rate');
  const [isFocused, setIsFocused] = useState(false);
  const [isSelectError, setIsSelectError] = useState(false);
  const [isInputError, setIsInputError] = useState(false);
  const { data: sessionData } = useSession();
  const { themeType } = useThemeContext();
  const router = useRouter();

  const queryClient = useQueryClient();
  const reviewListKey = getQueryKey(api.review.getAll);
  const { mutate: createReview, isLoading } = api.review.create.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: reviewListKey });
      setTempReview(null);
    },
  });
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!sessionData?.user) {
      void router.push('/auth/signin');

      return;
    }

    if (!query.trim()) {
      setIsInputError(true);

      return;
    }

    if (typeof rate === 'string') {
      setIsSelectError(true);

      return;
    }

    if (typeof rate === 'number') {
      setTempReview({
        id: '0',
        movieId,
        userId: sessionData.user.id,
        rating: rate,
        text: query.trim(),
        createdAt: new Date(),
      });

      createReview({
        movieId,
        text: query.trim(),
        rating: rate,
      });

      setQuery('');
      setRate('Rate');
    }
  };

  return (
    <form
      className="mb-8 sm:mb-12"
      onSubmit={handleSubmit}
      onClick={(e) => e.stopPropagation()}
    >
      <label className="relative mr-4 sm:mr-6">
        <div
          className={classNames(
            'absolute bottom-0 h-6 w-6 overflow-hidden rounded-full border border-light bg-primary opacity-0 transition-opacity sm:h-9 sm:w-9',
            { 'opacity-100': isFocused || query },
          )}
        >
          {sessionData ? (
            <Image
              src={sessionData.user?.image ?? '../../public/images/avatar.svg'}
              alt={sessionData.user?.name ?? 'user name'}
              fill
            />
          ) : (
            <Image
              src={'../../public/images/avatar.svg'}
              alt="profile avatar"
              fill
            />
          )}
        </div>
        <input
          type="text"
          placeholder="Add a review"
          value={query}
          disabled={isLoading}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsInputError(false);
          }}
          className={classNames(
            'font-body mb-3 w-3/4 border-b border-b-[#E84545] bg-dark pb-3 font-light text-dark caret-primary outline-none transition-all placeholder:text-sm focus:border-b-[#E84545] focus:pl-9 sm:pb-3 sm:focus:pl-14 lg:w-4/5',
            {
              'pl-9 sm:pl-14': query,
              'bg-light': themeType === ThemeType.Light,
              'text-light': themeType === ThemeType.Dark,
              'border-b-grey focus:border-b-primary': !isInputError,
            },
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </label>

      <label>
        <select
          className={classNames(
            'h-12 w-14 border-b border-b-[#E84545] bg-dark text-sm font-light text-dark outline-none focus:border-b-[#E84545]',
            {
              'bg-light': themeType === ThemeType.Light,
              'text-light': themeType === ThemeType.Dark,
              'border-b-grey focus:border-b-primary': !isSelectError,
            },
          )}
          value={rate}
          disabled={isLoading}
          onChange={(e) => {
            setRate(Number(e.target.value));
            setIsSelectError(false);
          }}
        >
          <option selected disabled>
            Rate
          </option>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((rate) => (
            <option key={rate}>{rate}</option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        className={classNames(
          'block rounded-lg border border-grey px-3 py-1 text-sm font-light text-dark transition hover:bg-primary sm:px-5 sm:text-base',
          { 'border-light text-light': themeType === ThemeType.Dark },
        )}
      >
        Send
      </button>
    </form>
  );
};
