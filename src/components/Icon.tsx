import { SVGProps } from "react";

const Icon = ({ id, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg role="img" {...props}>
      <use xlinkHref={`/sprite.svg#${id}`} />
    </svg>
  );
};

export default Icon;
