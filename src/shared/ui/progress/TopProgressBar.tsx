import { useRouteProgress } from './RouteProgressProvider';

const TopProgressBar = () => {
  const { isActive, progress } = useRouteProgress();

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-[10050]">
      <div
        className={`h-1 w-full transform bg-transparent transition-opacity duration-200 ${
          isActive ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className="h-full rounded-r-full bg-gradient-to-r from-[#4F7EFF] via-[#5C8BFF] to-[#8AAEFF] transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default TopProgressBar;
