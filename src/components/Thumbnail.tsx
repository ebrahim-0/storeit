import { cn, getFileIcon } from "@/lib/utils";

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
      <img
        src={isImage ? url : getFileIcon(extension, type)}
        alt="thumbnail"
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
