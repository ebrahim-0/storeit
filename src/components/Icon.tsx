const Icon = ({
  id,
  width,
  height,
  className,
  viewBox,
  sx = {},
  ...props
}: IconSvgProps) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox={viewBox}
      style={{ ...sx }}
      {...props}
    >
      <use xlinkHref={`/sprite.svg#${id}`} />
    </svg>
  );
};

export default Icon;
