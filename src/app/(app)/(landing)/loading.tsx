import Loader from "@/components/Loader";

const loading = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader size={80} />
    </div>
  );
};

export default loading;
