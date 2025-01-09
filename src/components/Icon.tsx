import { SVGProps } from "react";

const SvgHost =
  process.env.NODE_ENV === "development"
    ? "/sprite.svg"
    : `${process.env.NEXT_PUBLIC_HOST}/sprite.svg`;

const Icon = ({ id, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg role="img" {...props}>
      <use xlinkHref={`${SvgHost}#${id}`} />
    </svg>
  );
};

export default Icon;
