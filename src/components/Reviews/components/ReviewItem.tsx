import { type Review } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import avatar from '~/../public/images/avatar.svg';
import { SvgIcon } from '~/components/SvgIcon';
import { useThemeContext } from '~/contexts/useThemeContext';
import { ThemeType } from '~/types/ThemeType';
import { api } from '~/utils/api';
import { IconName, getIconByName } from '~/utils/getIconByName';
import { EditReviewForm } from './EditReviewForm';

const getReviewTime = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

type Props = {
  review: Review;
};

export const ReviewItem: React.FC<Props> = ({ review }) => {
  const { rating, text, createdAt, id } = review;
  const { themeType } = useThemeContext();
  const { data: userData = { image: String(avatar), name: 'username' } } =
    api.user.getById.useQuery({ id: review.userId });
  const { data: sessionData } = useSession();
  const [isSetting, setSetting] = useState(false);
  const [newText, setNewText] = useState(text.trim());
  const [newRate, setNewRate] = useState(rating);
  const [isEditing, setIsEditing] = useState(false);
  const [newTextError, setNewTextError] = useState(false);

  const queryClient = useQueryClient();
  const reviewListKey = getQueryKey(api.review.getAll);
  const { mutate: deleteReview, isLoading: isDeleteLoading } =
    api.review.delete.useMutation({
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: reviewListKey }),
    });

  const { mutate: changeReview, isLoading: isChangeLoading } =
    api.review.change.useMutation({
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: reviewListKey });
        setIsEditing(false);
      },
    });

  const handleDelete = () => {
    deleteReview({ id: review.id });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSetting(false);

    if (newText.trim() === text && newRate === rating) {
      setIsEditing(false);

      return;
    }

    if (!newText.trim()) {
      setNewTextError(true);

      return;
    }

    changeReview({
      id,
      text: newText.trim(),
      rating: newRate,
    });
  };

  useEffect(() => {
    const hideSettings = () => {
      setSetting(false);
    }

    document.addEventListener('click', hideSettings);

    return () => {
      document.removeEventListener('click', hideSettings);
    }
  }, []);

  return (
    <section
      className={classNames('flex items-start gap-2.5 sm:gap-5', {
        'pointer-events-none opacity-50': isDeleteLoading || isChangeLoading,
      })}
    >
      <div className="relative h-8 w-8 overflow-hidden rounded-full border border-light bg-primary sm:h-10 sm:w-10">
        <Image
          src={String(userData?.image)}
          alt={userData?.name ?? 'username'}
          fill
        />
      </div>
      <article
        className={classNames(
          'relative w-4/5 rounded-lg bg-grey bg-opacity-40 px-3.5 pb-7 pt-7 text-dark sm:w-2/3 sm:px-6 sm:pt-9 lg:w-3/4',
          {
            'text-light': themeType === ThemeType.Dark,
            'bg-semi-dark': themeType === ThemeType.Dark && review.userId !== sessionData?.user.id,
            'bg-primary': review.userId === sessionData?.user.id,
          },
        )}
      >
        {isEditing ? (
          <EditReviewForm
            handleUpdate={handleUpdate}
            newText={newText}
            setNewText={setNewText}
            newTextError={newTextError}
            setNewTextError={setNewTextError}
            newRate={newRate}
            setNewRate={setNewRate}
            setIsEditing={setIsEditing}
            rating={rating}
            text={text}
          />
        ) : (
          <>
            <h5 className="absolute left-3 top-3 text-xs sm:left-4 sm:text-sm">
              {userData?.name || 'Anonymus'}
            </h5>
            <p className="overflow-x-hidden text-clip text-sm font-light sm:text-base">
              {text}
            </p>

            <button
              className={classNames(
                'absolute right-2 top-3 opacity-70 hover:opacity-100',
                { hidden: review.userId !== sessionData?.user.id },
              )}
              onClick={(e) => {
                e.stopPropagation();
                setSetting(state => !state);
              }}
            >
              <SvgIcon
                className={classNames('h-5 w-5 fill-dark', {
                  'fill-light': themeType === ThemeType.Dark,
                })}
              >
                {getIconByName(IconName.SETTINGS)}
              </SvgIcon>
            </button>

            <div className="absolute bottom-2 right-4 flex items-center gap-1 sm:gap-2">
              <div className="flex items-center gap-1">
                <div
                  className={classNames('h-1.5 w-1.5 rounded-full', {
                    'bg-[#3B931C]': rating > 7.4,
                    'bg-[#FFF961]': rating > 4.9 && rating < 7.5,
                    'bg-[#E84545]': rating < 5,
                  })}
                />
                <p className="text-xs font-light sm:text-sm">
                  {`${rating}/10`}
                </p>
              </div>
              <p className="text-xs font-light opacity-50 sm:text-sm">
                {getReviewTime(createdAt)}
              </p>
            </div>

            {isSetting && (
              <div
                className={classNames(
                  'absolute -top-14 right-0 flex w-max flex-col gap-1 rounded-lg bg-[#DADADA] px-5 py-1 text-center text-sm font-light sm:-right-[90px] sm:top-0',
                  { 'bg-semi-dark': themeType === ThemeType.Dark },
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <p
                  className={classNames(
                    'cursor-pointer text-dark hover:text-primary',
                    { 'text-light': themeType === ThemeType.Dark },
                  )}
                  onClick={() => handleDelete()}
                >
                  Delete
                </p>

                <p
                  className={classNames(
                    'cursor-pointer text-dark hover:text-primary',
                    { 'text-light': themeType === ThemeType.Dark },
                  )}
                  onClick={(e) => {
                    if (!isEditing) {
                      e.stopPropagation();
                    }
                    setIsEditing(true);
                    setSetting(false);
                  }}
                >
                  Change
                </p>
              </div>
            )}
          </>
        )}
      </article>
    </section>
  );
};
