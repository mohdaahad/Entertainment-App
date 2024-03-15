import classNames from 'classnames';
import {
  useEffect,
  useRef,
  type Dispatch,
  type FC,
  type SetStateAction,
} from 'react';
import { useThemeContext } from '~/contexts/useThemeContext';
import { ThemeType } from '~/types/ThemeType';
import useAutosizeTextArea from '~/hooks/useAutosizeTextArea';

type Props = {
  handleUpdate: (e: React.FormEvent) => void;
  newText: string;
  setNewText: Dispatch<SetStateAction<string>>;
  newTextError: boolean;
  setNewTextError: Dispatch<SetStateAction<boolean>>;
  newRate: number;
  setNewRate: Dispatch<SetStateAction<number>>;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  rating: number;
  text: string;
};

export const EditReviewForm: FC<Props> = ({
  handleUpdate,
  newText,
  setNewText,
  newTextError,
  setNewTextError,
  newRate,
  setNewRate,
}) => {
  const { themeType } = useThemeContext();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef.current, newText);

  useEffect(() => {
    if (textAreaRef.current !== null) {
      textAreaRef.current.focus();
    }
  }, [])

  return (
    <form 
      className='font-light flex flex-col gap-1 items-end' 
      onSubmit={handleUpdate} 
      onClick={(e) => e.stopPropagation()}
    >
      <textarea
        value={newText}
        rows={1}
        ref={textAreaRef}
        onChange={(e) => {
          setNewText(e.target.value);
          setNewTextError(false);
        }}
        className={classNames(
          'bg-semi-dark bg-opacity-0 w-full border-b border-b-grey mb-2 caret-primary outline-none resize-none overflow-hidden focus:border-b-primary',
          { 'border-b-[#E84545] focus:border-b-[#E84545]': newTextError }
        )}
        onFocus={() => setNewText((state) => state + ' ')}
      />

      <div>
        <select
          value={newRate}
          onChange={(e) => setNewRate(Number(e.target.value))}
          className={classNames(
            'mr-5 bg-light bg-opacity-0 border-b border-b-grey pb-1 outline-none focus:border-b-primary',
          )}
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map(rate => (
            <option 
              className={themeType === ThemeType.Light ? 'bg-grey' : 'bg-semi-dark'}
              key={rate}
            >
              {rate}
            </option>
          ))}
        </select>

        <button
          type='submit'
          className={classNames(
            ' px-2 sm:px-3 py-1 font-light text-sm sm:text-base text-dark border border-dark rounded-lg hover:bg-primary transition',
            { 'text-light border-light': themeType === ThemeType.Dark }
          )}
        >
          Send
        </button>
      </div>
    </form>
  );
};
