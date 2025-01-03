import { SVGProps } from "react";

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
      <use xlinkHref={`/sprite.svg#${id}`} />
    </svg>
  );
};

export default Icon;
