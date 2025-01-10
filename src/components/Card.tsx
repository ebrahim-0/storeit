import Link from "next/link";
import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";
import { convertFileSize } from "@/lib/utils";
import FormattedDateTime from "./FormattedDateTime";
import { ActionDropdown } from "./ActionDropdown";
import OwnerFileInfo from "./OwnerFileInfo";
import Text from "./ui/Text";

const Card = ({ file }: { file: Models.Document }) => {
  return (
    <Link
      href={`viewer/${file?.bucketFileId}`}
      target="_blank"
      className="flex flex-col gap-6 rounded-[18px] bg-white p-5 shadow-sm transition-all hover:shadow-drop-3"
    >
      <div className="flex justify-between">
        <Thumbnail
          type={file.type}
          extension={file.extension}
          url={`/api/files/${file?.bucketFileId}`}
          // url={constructFileUrl(file?.bucketFileId)}
          className="!size-20"
        />

        <div className="ml-3 flex flex-col items-end justify-between">
          <ActionDropdown file={file} />
          <p className="body-2">{convertFileSize(file.size)}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-light-100">
        <Text tooltip={file.name} toolTipClass="!max-w-full" side="bottom">
          <p className="subtitle-2 truncate">{file.name}</p>
        </Text>

        <FormattedDateTime
          date={file.$createdAt}
          className="body-2 text-light-100"
        />

        <OwnerFileInfo file={file} />
      </div>
    </Link>
  );
};

export default Card;
