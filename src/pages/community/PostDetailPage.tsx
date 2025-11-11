import PostDetailBody from '@/widgets/community/ui/PostDetailBody';
import Horizon from '@/shared/ui/layout/Horizon';
import { useHeaderConfig } from '@/widgets/header/model/HeaderConfigContext';

const PostDetail = () => {
  useHeaderConfig(
    () => ({
      isShowPrev: true,
      children: '자유게시판',
      empty: true
    }),
    []
  );

  return (
    <div className="flex min-h-nav-safe w-full flex-col items-center bg-gray-50">
      <Horizon lineBold="thin" lineWidth="long" />
      <div className="w-full max-w-[430px] px-6 pt-[66px] pb-20 md:max-w-5xl md:px-0 md:pt-8">
        <PostDetailBody />
      </div>
    </div>
  );
};

export default PostDetail;
