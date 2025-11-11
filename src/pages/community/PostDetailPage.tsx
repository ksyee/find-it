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
    <div className="flex h-nav-safe w-full flex-col items-center">
      <Horizon lineBold="thin" lineWidth="long" />
      <div className="w-full max-w-[430px] px-6 pt-[66px] md:pt-8">
        <div
          className="flex w-full justify-center overflow-auto"
          style={{
            height: 'calc(100dvh - 66px - var(--app-nav-bottom) - 16px)'
          }}
        >
          <PostDetailBody />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
