import { type FC } from 'react';
import { Category } from '~/types/Category.enum';
import { type MovieType } from '~/types/Movie';
import { Rating } from '~/components/Rating';

type Props = {
  movie: MovieType;
  category: Category;
  rating: number;
};

export const MovieInfo: FC<Props> = ({ movie, category, rating }) => {
  return (
    <>
      <h3 className="mb-4 text-lg font-medium">Description</h3>

      <p className="mb-8 font-light">{movie.overview}</p>

      <h3 className="mb-4 text-lg font-medium">Status</h3>

      <p className="mb-8 font-light">{movie.status}</p>

      <h3 className="mb-4 text-lg font-medium">Original language</h3>

      <p className="mb-8 font-light">{movie.original_language.toUpperCase()}</p>

      <h3 className="mb-4 text-lg font-medium">Rating</h3>

      <div className="items-between mb-8 flex w-max flex-col">
        <Rating title="TMDB" average={movie.vote_average} />

        <Rating title="Movies Ent." average={rating} />
      </div>

      <h3 className="mb-4 text-lg font-medium">Genres</h3>
      <p className="mb-8 font-light">
        {movie.genres
          .reduce((acc, genre) => {
            return acc + genre.name + ', ';
          }, '')
          .slice(0, -2)}
      </p>

      {category === Category.MOVIE ? (
        <>
          <h3 className="mb-4 text-lg font-medium">Duration</h3>
          <p className="font-light">{movie.runtime} min.</p>
        </>
      ) : (
        <>
          <h3 className="mb-4 text-lg font-medium">Seasons</h3>
          <table className="w-4/5 text-left sm:w-2/3 lg:w-full">
            <tr className="text-sm">
              <th className="pr-3">Name</th>
              <th className="pr-3">Series count</th>
              <th>Release date</th>
            </tr>
            {movie.seasons?.map((season) => (
              <tr key={season.id} className="font-light">
                <td className="pr-3">{season.name}</td>
                <td>{season.episode_count}</td>
                <td>
                  {season.air_date ? season.air_date.split('-').join('.') : '-'}
                </td>
              </tr>
            ))}
          </table>
        </>
      )}
    </>
  );
};
