const Skeleton = () => {
  return (
    <div className="mb-3 flex h-[140px] w-full items-center justify-between rounded-2xl bg-white pr-[10px] pl-[20px] shadow lg:h-[160px]">
      <div className="flex-grow space-y-3">
        <div className="h-[26px] w-[128px] animate-pulse rounded-lg bg-slate-200"></div>
        <div className="h-[21px] w-[61px] animate-pulse rounded-full bg-slate-200"></div>
        <div className="h-[16px] w-[46px] animate-pulse rounded-lg bg-slate-200"></div>
        <div className="h-[16px] w-[77px] animate-pulse rounded-lg bg-slate-200"></div>
      </div>
      <div className="animate-shimmer h-[120px] w-[120px] animate-pulse rounded-xl bg-slate-200 flex-shrink-0"></div>
    </div>
  );
};

export default Skeleton;
