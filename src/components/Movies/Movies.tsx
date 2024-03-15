import { useState, type FC } from 'react';
import { useBookmarksContext } from '~/contexts/useBookmarksContext';
import { type Category } from '~/types/Category.enum';
import { type MoviesType } from '~/types/Movie';
import { type IconName } from '~/utils/getIconByName';
import { MovieCard } from './components/MovieCard';

type Props = {
  movies: MoviesType;
  title?: string;
  category?: Category;
};

export const Movies: FC<Props> = ({
  movies = [],
  title = 'Movies',
  category,
}) => {
  const [playingId, setPlayingId] = useState(0);
  const { bookmarks, isInBookmarks, addToBookmarks, deleteFromBookmarks } =
    useBookmarksContext();

  const handleAddToBookmarks = (id: number, type: Category) => {
    addToBookmarks(id, type);
  };

  const handleRemoveFromBookmarks = (id: number) => {
    deleteFromBookmarks(id);
  };

  return (
    <section className="mb-6 pb-8 sm:mb-10">
      <h2 className="mb-6 text-xl font-light sm:text-[32px] lg:mb-10">
        {title}
      </h2>

      <div
        className="
          grid grid-cols-2 gap-4 sm:grid-cols-3 
          sm:gap-x-7 sm:gap-y-6 xl:grid-cols-4 xl:gap-x-10 xl:gap-y-8
        "
      >
        {movies.length > 0 && (
          <>
            {movies.map((movie) => {
              const {
                id,
                backdrop_path,
                title,
                name,
                release_date,
                first_air_date,
                media_type,
                poster_path,
                original_language,
                vote_average,
              } = movie;

              const isBookmarked = isInBookmarks(id);

              let type = category ? category : media_type;

              type = //! rewrite 56-60
                bookmarks.find(({ movieId }) => movieId === id)?.type || type;

              return (
                <MovieCard
                  key={`${type || 'item'}_${id}`}
                  movieId={id}
                  imagePath={backdrop_path || poster_path || ''}
                  title={title || name}
                  releaseDate={release_date || first_air_date}
                  categoryIcon={type as IconName}
                  category={type as Category}
                  language={original_language}
                  rating={vote_average}
                  playingId={playingId}
                  isBookmarkedInitial={isBookmarked}
                  onPlayingChange={setPlayingId}
                  onBookmarksAdd={handleAddToBookmarks}
                  onBookmarksRemove={handleRemoveFromBookmarks}
                />
              );
            })}
          </>
        )}
      </div>
    </section>
  );
};
