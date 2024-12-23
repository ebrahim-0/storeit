import Link from "next/link";
import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";
import { convertFileSize } from "@/lib/utils";
import FormattedDateTime from "./FormattedDateTime";
import ActionDropdown from "./ActionDropdown";

const Card = ({ file }: { file: Models.Document }) => {
  return (
    <Link
      // href={file.url}
      href={`viewer/${file?.bucketFileId}`}
      target="_blank"
      className="flex flex-col gap-6 rounded-[18px] bg-white p-5 shadow-sm transition-all hover:shadow-drop-3"
    >
      <div className="flex justify-between">
        <Thumbnail
          type={file.type}
          extension={file.extension}
          url={file.url}
          className="!size-20"
          //   imageClassName="!size-11"
        />

        <div className="ml-3 flex flex-col items-end justify-between">
          <ActionDropdown file={file} />
          <p className="body-2">{convertFileSize(file.size)}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-light-100">
        <p className="subtitle-2 line-clamp-2">{file.name}</p>

        <FormattedDateTime
          date={file.$createdAt}
          className="body-2 text-light-100"
        />

        <p className="caption line-clamp-1 text-light-200">
          By: {file.owner?.fullName}
        </p>
      </div>
    </Link>
  );
};

export default Card;
