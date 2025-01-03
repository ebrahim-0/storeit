const Loader = ({
  size = 24,
  strokeWidth = 4,
}: {
  size?: number;
  strokeWidth?: number;
}) => {
  return (
    <div
      style={{ width: size, height: size, borderWidth: strokeWidth }}
      className="border-brand-100/50 animate-spin rounded-full border-4 border-t-brand"
    />
  );
};

export default Loader;
