import { type FC } from 'react';
import { SvgIcon } from '~/components/SvgIcon';
import { IconName, getIconByName } from '~/utils/getIconByName';

type Props = {
  handlePopup: () => void;
};

export const TrailerButton: FC<Props> = ({ handlePopup }) => {
  return (
    <button
      className="
        text-md relative flex h-10 w-full items-center justify-center gap-2
        rounded-lg  bg-[#ff0000] bg-opacity-75 text-light transition
        hover:bg-opacity-100 sm:w-[48%] lg:w-full xl:w-[48%]
        "
      onClick={handlePopup}
    >
      <SvgIcon className="h-7 w-7 fill-light" viewBox="0 0 32 32">
        {getIconByName(IconName.YT)}
      </SvgIcon>
      Watch&nbsp;trailer
    </button>
  );
};
