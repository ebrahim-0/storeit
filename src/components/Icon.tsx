import { SVGProps } from "react";

const spriteUrl =
  process.env.NODE_ENV === "production"
    ? "https://pre.store-it.live/sprite.svg"
    : "/sprite.svg";

const Icon = ({
  id,
  width,
  height,
  className,
  viewBox,
  sx = {},
  ...props
}: IconSvgProps & SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox={viewBox}
      style={{ ...sx }}
      role="img"
      {...props}
    >
      <use xlinkHref={`${spriteUrl}#${id}`} />
      {/* <use xlinkHref={`/sprite.svg#${id}`} /> */}
    </svg>
  );
};

export default Icon;
