import Loader from "@/components/Loader";

const loading = () => {
  return (
    <div className="mx-auto flex h-full min-h-[calc(100vh-80px)] items-center justify-center">
      <Loader size={80} />
    </div>
  );
};

export default loading;
