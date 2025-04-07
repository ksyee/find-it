import { useState } from 'react';
import IconSelectItem from '@/components/common/atom/IconSelectItem';

interface ButtonSelectItemProps {
  firstName?: string;
  secondName?: string;
  onClickFirst?: () => void;
  onClickSecond?: () => void;
  disabledSecond: boolean;
  hasFirstSelection?: boolean;
  hasSecondSelection?: boolean;
}

const ButtonSelectItem: React.FC<ButtonSelectItemProps> = ({
  firstName = '대분류 선택',
  secondName = '소분류 선택',
  onClickFirst,
  onClickSecond,
  disabledSecond,
  hasFirstSelection = false,
  hasSecondSelection = false,
}) => {
  /* -------------------------------------------------------------------------- */
  // 버튼 선택시 스타일변경 & 상위 프롭 함수 실행
  const isActiveColor = '#4785ff';
  const commonStyle =
    'flex h-fit items-center truncate rounded-full px-14px py-6px text-10px';

  const onFirst = () => {
    if (onClickFirst) {
      onClickFirst();
    }
  };
  const onSecond = () => {
    if (onClickSecond) {
      onClickSecond();
    }
  };

  // 실제 선택된 값에 따라 색상 결정
  const firstTextColor = hasFirstSelection ? isActiveColor : 'black';
  const firstBorderColor = hasFirstSelection ? isActiveColor : '#666';

  const secondTextColor = hasSecondSelection ? isActiveColor : '#666';
  const secondBorderColor = hasSecondSelection
    ? isActiveColor
    : disabledSecond
      ? '#BCBCBC'
      : '#666';

  /* -------------------------------------------------------------------------- */
  // jsx 반환
  return (
    <div className="flex gap-10px">
      <button
        onClick={onFirst}
        className={commonStyle}
        type="button"
        style={{
          color: firstTextColor,
          border: `1px solid ${firstBorderColor}`,
        }}
      >
        {firstName}
        <IconSelectItem color={firstTextColor} />
      </button>
      <button
        onClick={onSecond}
        disabled={disabledSecond}
        className={commonStyle}
        type="button"
        style={{
          color: secondTextColor,
          border: `1px solid ${secondBorderColor}`,
        }}
      >
        {secondName}
        <IconSelectItem color={secondTextColor} />
      </button>
    </div>
  );
};

export default ButtonSelectItem;
