interface timeProps {
  createdAt: string;
}

export const getTimeDiff: React.FC<timeProps> = ({ createdAt }) => {
  // 현재 시간을 가져오기
  const now = new Date();

  // 생성 시간을 Date 객체로 변환
  const createdDate = new Date(createdAt);

  // 유효한 날짜인지 확인
  if (isNaN(createdDate.getTime())) {
    return <span className="text-10px text-gray-450">날짜 정보 없음</span>;
  }

  // 디버깅을 위한 로그
  console.log('현재 시간:', now.toISOString());
  console.log('생성 시간:', createdDate.toISOString());

  // 시간 차이 계산
  const milliSeconds = now.getTime() - createdDate.getTime();
  console.log('시간 차이(ms):', milliSeconds);

  // 방금 작성한 글이면 (10초 이내)
  if (milliSeconds < 10 * 1000) {
    return <span className="text-10px text-gray-450">방금 전</span>;
  }

  const seconds = milliSeconds / 1000;
  if (seconds < 60) {
    return <span className="text-10px text-gray-450">방금 전</span>;
  }

  const minutes = seconds / 60;
  if (minutes < 60) {
    return (
      <span className="text-10px text-gray-450">
        {Math.floor(minutes)}분 전
      </span>
    );
  }

  const hours = minutes / 60;
  if (hours < 24) {
    return (
      <span className="text-10px text-gray-450">
        {Math.floor(hours)}시간 전
      </span>
    );
  }

  const days = hours / 24;
  if (days < 7) {
    return (
      <span className="text-10px text-gray-450">{Math.floor(days)}일 전</span>
    );
  }

  const weeks = days / 7;
  if (weeks < 5) {
    return (
      <span className="text-10px text-gray-450">{Math.floor(weeks)}주 전</span>
    );
  }

  const months = days / 30;
  if (months < 12) {
    return (
      <span className="text-10px text-gray-450">
        {Math.floor(months)}개월 전
      </span>
    );
  }

  const years = days / 365;
  return (
    <span className="text-10px text-gray-450">{Math.floor(years)}년 전</span>
  );
};
