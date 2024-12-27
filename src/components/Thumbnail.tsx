import { cn, getFileIcon } from "@/lib/utils";
import LoadImage from "./LoadImage";
import { Skeleton } from "./ui/skeleton";

const Thumbnail = ({
  type,
  extension,
  url = "",
  imageClassName,
  className,
}: ThumbnailProps) => {
  const isImage = type === "image" && extension !== "svg";

  return (
    <figure
      className={cn(
        "flex-center size-[60px] min-w-[60px] overflow-hidden rounded-full bg-brand/10",
        className,
      )}
    >
      <LoadImage
        loaderSize={60}
        src={isImage ? url : getFileIcon(extension, type)}
        alt="thumbnail"
        customLoader={<Skeleton className="size-[60px] rounded-full" />}
        width={100}
        height={100}
        className={cn(
          "size-8 object-contain",
          imageClassName,
          isImage && "size-full object-cover object-center",
        )}
      />
    </figure>
  );
};

export default Thumbnail;
