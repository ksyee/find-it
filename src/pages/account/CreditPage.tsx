import { useHeaderConfig } from '@/widgets/header/model/HeaderConfigContext';

const Main = () => {
  return (
    <div className="w-[375px] px-[30px]">
      <ul className="mt-[51px] flex flex-col gap-[24px]">
        <li className="transition-all duration-300 hover:rounded hover:bg-gray-100">
          <a
            href="https://github.com/ksyee"
            className="flex flex-col gap-3 px-[10px] py-2"
          >
            <p className="text-lg">SEONYOUNG KANG</p>
            <p className="text-xs text-gray-400">github@ksyee</p>
          </a>
        </li>
        <li className="transition-all duration-300 hover:rounded hover:bg-gray-100">
          <a
            href="https://github.com/bellori729"
            className="flex flex-col gap-3 px-[10px] py-2"
          >
            <p className="text-lg">JONGDEOK KIM</p>
            <p className="text-xs text-gray-400">github@bellori729</p>
          </a>
        </li>
        <li className="transition-all duration-300 hover:rounded hover:bg-gray-100">
          <a
            href="https://github.com/zooyaam"
            className="flex flex-col gap-3 px-[10px] py-2"
          >
            <p className="text-lg">YUNJOO CHO</p>
            <p className="text-xs text-gray-400">github@zooyaam</p>
          </a>
        </li>
        <li className="transition-all duration-300 hover:rounded hover:bg-gray-100">
          <a
            href="https://www.instagram.com/jujung.hyn/"
            className="flex flex-col gap-3 px-[10px] py-2"
          >
            <p className="text-lg">HYUNJU JUNG</p>
            <p className="text-xs text-gray-400">instagram@jujung.hyn</p>
          </a>
        </li>
      </ul>
    </div>
  );
};

const Credit = () => {
  useHeaderConfig(
    () => ({
      isShowPrev: true,
      children: '만든 사람들',
      empty: true
    }),
    []
  );

  return (
    <div className="flex w-full flex-col items-center pt-[66px]">
      <Main />
    </div>
  );
};

export default Credit;
