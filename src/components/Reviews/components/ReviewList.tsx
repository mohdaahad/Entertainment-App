import { type Review } from '@prisma/client';
import React from 'react';
import { ReviewItem } from './ReviewItem';

type Props = {
  reviews: Review[];
};

export const ReviewList: React.FC<Props> = ({ reviews }) => {
  return (
    <ul className="flex flex-col gap-5 sm:gap-8">
      {reviews.map((review) => {
        return <ReviewItem key={review.id} review={review} />;
      })}
    </ul>
  );
};
