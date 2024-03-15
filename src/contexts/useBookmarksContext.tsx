import { type Bookmark } from '@prisma/client';
import { createContext, useContext, type FC } from 'react';
import { useBookmarks } from '~/hooks/useBookmarks';
import { type Category } from '~/types/Category.enum';

type BookmarksContextValue = {
  currentId: number | null;
  bookmarks: Bookmark[];
  isInBookmarks: (movieId: number) => boolean;
  addToBookmarks: (movieId: number, type: Category) => void;
  deleteFromBookmarks: (movieId: number) => void;
};

const BookmarksContext = createContext<BookmarksContextValue | undefined>(
  undefined,
);

interface BookmarksContextProviderProps {
  children: React.ReactNode;
}

export const BookmarksContextProvider: FC<BookmarksContextProviderProps> = ({
  children,
}) => {
  const {
    currentId,
    bookmarks,
    isInBookmarks,
    addToBookmarks,
    deleteFromBookmarks,
  } = useBookmarks();

  return (
    <BookmarksContext.Provider
      value={{
        currentId,
        bookmarks,
        isInBookmarks,
        addToBookmarks,
        deleteFromBookmarks,
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
};

export const useBookmarksContext = () => {
  const bookmarksContext = useContext(BookmarksContext);

  if (bookmarksContext === undefined) {
    throw new Error('useBookmarksContext must be inside a BookmarksContext');
  }

  return bookmarksContext;
};
