import DotPulse from './DotPulse';

const FullScreenSpinner = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white">
      <DotPulse size="lg" />
      <p className="text-sm text-gray-500">로딩 중입니다...</p>
    </div>
  );
};

export default FullScreenSpinner;
