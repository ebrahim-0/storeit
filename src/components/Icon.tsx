import { SVGProps } from "react";

const SvgHost =
  process.env.NODE_ENV === "development"
    ? "/sprite.svg"
    : `${process.env.NEXT_PUBLIC_HOST}/sprite.svg`;

const Icon = ({
  id,
  size,
  ...props
}: { size?: string | number } & SVGProps<SVGSVGElement>) => {
  return (
    <svg
      role="img"
      style={{
        width: size ?? props.width,
        height: size ?? props.height,
        ...props.style,
      }}
      {...props}
    >
      <use xlinkHref={`${SvgHost}#${id}`} />
    </svg>
  );
};

export default Icon;
