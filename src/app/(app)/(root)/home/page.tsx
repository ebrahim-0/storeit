import Image from "next/image";

const page = () => {
  return (
    <div>
      <Image
        src="assets/standaloneIcons/Illustration.svg"
        width={342}
        height={342}
        alt="Illustration"
        className="transition-all hover:rotate-2 hover:scale-105"
      />
    </div>
  );
};

export default page;
