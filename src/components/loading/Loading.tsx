import LottiePackage from "lottie-react";
import defaultAnimation from "../../assets/Shop.json";

const Lottie = (LottiePackage as any).default || LottiePackage;

interface LoadingProps {
  animation?: any;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ animation, fullScreen = true }) => {
  const animationData = animation || defaultAnimation;

  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "fixed inset-0 z-[100] bg-white/90 backdrop-blur-sm" : "w-full py-10"
      }`}
    >
      <Lottie
        animationData={animationData}
        loop
        autoplay
        style={{ height: 300, width: 300 }}
      />
    </div>
  );
};

export default Loading;