import { SVGProps } from "react";

const Icon = ({
  id,
  width,
  height,
  className,
  viewBox,
  ...props
}: IconSvgProps & SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox={viewBox}
      role="img"
      {...props}
    >
      <use xlinkHref={`https://pre.store-it.live/sprite.svg#${id}`} />
    </svg>
  );
};

export default Icon;
