import { useSession } from 'next-auth/react';
import { useCallback, useState } from 'react';
import { type Category } from '~/types/Category.enum';
import { api } from '~/utils/api';

export const useBookmarks = () => {
  const [currentId, setCurrentId] = useState<number | null>(null);
  const { data: sessionData } = useSession();
  const { data: bookmarks = [], refetch } = api.bookmark.getAll.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: () => setCurrentId(null),
      onError: () => setCurrentId(null),
    },
  );

  const createBookmark = api.bookmark.create.useMutation({
    onSuccess: () => void refetch(),
  });

  const deleteBookmark = api.bookmark.delete.useMutation({
    onSuccess: () => void refetch(),
  });

  const addToBookmarks = useCallback((movieId: number, type: Category) => {
    setCurrentId(movieId);
    createBookmark.mutate({ movieId, type });
  }, [createBookmark]);

  const deleteFromBookmarks = useCallback((movieId: number) => {
    setCurrentId(movieId);
    deleteBookmark.mutate({ movieId });
  }, [deleteBookmark]);

  const isInBookmarks = useCallback(
    (movieId: number) => {
      return bookmarks.some((bookmark) => bookmark.movieId === movieId);
    },
    [bookmarks],
  );

  return {
    currentId,
    bookmarks,
    isInBookmarks,
    addToBookmarks,
    deleteFromBookmarks,
  };
};
