import { SVGProps } from "react";

const SvgHost =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5190"
    : process.env.NEXT_PUBLIC_HOST;

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
      <use xlinkHref={`${SvgHost}/sprite.svg#${id}`} />
    </svg>
  );
};

export default Icon;
