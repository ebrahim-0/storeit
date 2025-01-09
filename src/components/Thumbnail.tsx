import { cn, getFileIcon } from "@/lib/utils";
import Icon from "./Icon";

const Thumbnail = ({
  type,
  extension,
  url = "",
  imageClassName,
  className,
  iconSize,
}: ThumbnailProps) => {
  const isImage = type === "image" && extension !== "svg";

  return (
    <figure
      className={cn(
        "flex-center size-[60px] min-w-[60px] overflow-hidden rounded-full bg-brand/10",
        className,
      )}
    >
      {isImage ? (
        <img
          src={url}
          alt="thumbnail"
          width={100}
          height={100}
          loading="lazy"
          className={cn(
            "size-8 object-contain",
            imageClassName,
            isImage && "size-full object-cover object-center",
          )}
        />
      ) : (
        <Icon
          id={getFileIcon(extension, type)}
          width={iconSize || 44}
          height={iconSize || 44}
          color="hsl(var(--brand-default))"
          viewBox="0 0 44 44"
        />
      )}
    </figure>
  );
};

export default Thumbnail;
