import { Loader } from '~/components/Loader/Loader';
import { SvgIcon } from '~/components/SvgIcon';
import { getIconByName, IconName } from '~/utils/getIconByName';

type Props = {
  trailerKey: string;
  onClose: () => void;
};

export const MovieTrailerPopup = ({ trailerKey, onClose }: Props) => {
  return (
    <div
      className="
        fixed bottom-0 left-0 right-0 top-0
        flex items-center justify-center
        bg-dark bg-opacity-75 p-4 sm:p-20 lg:p-40
      "
      onClick={onClose}
    >
      <button className="absolute right-4 top-4">
        <SvgIcon className="h-8 w-8 fill-light" viewBox="0 0 30 30">
          {getIconByName(IconName.CLOSE)}
        </SvgIcon>
      </button>

      <div className="relative w-full pt-[56.25%]">
        <Loader />

        <iframe
          className="absolute top-0 h-full w-full"
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
};
