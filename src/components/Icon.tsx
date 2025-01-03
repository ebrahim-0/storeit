interface Props {
  id: string;
  width: number;
  height: number;
}

const Icon = ({ id, width, height }: Props) => (
  <svg width={width} height={height}>
    <use xlinkHref={`#icon-${id}`} />
  </svg>
);

export default Icon;
