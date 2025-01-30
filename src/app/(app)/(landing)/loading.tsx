import Loader from "@/components/Loader";

const loading = () => {
  return (
    <div className="flex h-[calc(100vh-111px)] items-center justify-center">
      <Loader size={80} />
    </div>
  );
};

export default loading;
