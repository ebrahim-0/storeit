const loading = () => {
  return (
    <div className="mx-auto flex h-full min-h-[calc(100vh-80px)] items-center justify-center">
      <div className="h-20 w-20 animate-spin rounded-full border-4 border-t-4 border-brand/50 border-t-brand-100" />
    </div>
  );
};

export default loading;
