import Image from 'next/image';

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <Image
        src="/icons/loading-circle.svg"
        alt="Loading..."
        width={50}
        height={50}
        className="animate-spin" // Adding spin animation
      />
    </div>
  );
};

export default Loader;
