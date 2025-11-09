import { useState, useEffect, SetStateAction } from 'react';
import Header from '@/widgets/header/ui/Header';
import Notice from '@/pages/notification/NoticePage';
import Setting from '@/pages/notification/SettingPage';

interface CategoriesProps {
  onChangeCategory: React.Dispatch<SetStateAction<string>>;
}

const Categories = ({ onChangeCategory }: CategoriesProps) => {
  const [voidAlarmIcon, setVoidAlarmIcon] = useState(false);
  const [activeButton, setActiveButton] = useState('notice');
  const handleClick = (button: SetStateAction<string>) => {
    setActiveButton(button);
    onChangeCategory(button);
  };

  // 추천 알림이 있으면 스타일 표시
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedRecommendations = window.localStorage.getItem('recommendations');
      if (!savedRecommendations || savedRecommendations === '[]') {
        setVoidAlarmIcon(false);
      } else {
        setVoidAlarmIcon(true);
      }
    } catch (error) {
      console.warn('Failed to read recommendations', error);
      setVoidAlarmIcon(false);
    }
  }, []);

  return (
    <div className="flex w-[375px]">
      <button
        className={`relative w-1/2 border-b-[1px] pb-[12px] pt-[13px] text-center text-sm transition-colors duration-300 ${activeButton === 'notice' ? 'border-black' : 'text-gray-400'}`}
        onClick={() => handleClick('notice')}
      >
        내 키워드 알림
        {voidAlarmIcon && (
          <p
            className={`absolute right-[37px] top-[13px] h-[7px] w-[7px] rounded-full bg-primary ${activeButton === 'setting' ? 'opacity-70' : ''}`}
          >
            &nbsp;
          </p>
        )}
      </button>
      <button
        className={`w-1/2 border-b-[1px] pb-[12px] pt-[13px] text-center text-sm transition-colors duration-300 ${activeButton === 'setting' ? 'border-black' : 'text-gray-400'}`}
        onClick={() => handleClick('setting')}
      >
        키워드 설정
      </button>
    </div>
  );
};

const Notification = () => {
  const [activeCategory, setActiveCategory] = useState('notice');
  return (
    <div className="flex w-full min-w-[375px] flex-col items-center">
      <Header isShowPrev={true} children="키워드 알림" empty={true} />
      <Categories onChangeCategory={setActiveCategory} />
      {activeCategory === 'notice' && <Notice />}
      {activeCategory === 'setting' && <Setting />}
    </div>
  );
};

export default Notification;
