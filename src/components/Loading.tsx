import Lottie from "lottie-react";
import animationData from "../assets/loading.json";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-40">
        <Lottie animationData={animationData} loop />
      </div>
    </div>
  );
};

export default Loading;
