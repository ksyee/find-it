import { ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface NavigationItemProps {
  isActive?: boolean;
  trueIcon: string;
  falseIcon: string;
  children?: ReactNode;
  link: string;
}

const NavigationItem = ({
  isActive,
  trueIcon,
  falseIcon,
  children,
  link
}: NavigationItemProps) => {
  const PARAGRAPH_FALSE_STYLE =
    'font-OAGothic -tracking-[0.3px] text-center text-[10px] text-gray-700';
  const PARAGRAPH_TRUE_STYLE =
    'font-OAGothic -tracking-[0.3px] text-center text-[10px] text-primary';

  // 두 이미지를 미리 로드하여 전환 시 깜빡임 방지
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    // 두 이미지를 미리 로드
    const preloadImages = () => {
      const trueImg = new Image();
      const falseImg = new Image();

      let loadedCount = 0;
      const checkLoaded = () => {
        loadedCount++;
        if (loadedCount === 2) {
          setImagesLoaded(true);
        }
      };

      trueImg.onload = checkLoaded;
      falseImg.onload = checkLoaded;

      trueImg.src = trueIcon;
      falseImg.src = falseIcon;
    };

    preloadImages();
  }, [trueIcon, falseIcon]);

  return (
    <Link
      to={link}
      className="flex h-[60px] w-[54px] flex-col items-center justify-center gap-[5px] transition-all duration-200"
      style={{ opacity: imagesLoaded ? 1 : 0 }}
    >
      <img
        src={isActive ? trueIcon : falseIcon}
        alt={`${children} 아이콘`}
        className="transition-opacity duration-200"
      />
      <p className={isActive ? PARAGRAPH_TRUE_STYLE : PARAGRAPH_FALSE_STYLE}>
        {children}
      </p>
    </Link>
  );
};

export default NavigationItem;
