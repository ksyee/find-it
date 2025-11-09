import Header from '@/widgets/header/ui/Header';
import PostDetailBody from '@/widgets/community/ui/PostDetailBody';
import Horizon from '@/shared/ui/layout/Horizon';

const PostDetail = () => {
  return (
    <div className="flex h-nav-safe w-full flex-col items-center">
      <Header isShowPrev={true} children="자유게시판" empty={true} />
      <Horizon lineBold="thin" lineWidth="long" />
      <div className="w-[375px]">
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
