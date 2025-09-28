import Header from '@/widgets/header/ui/Header';
import PostDetailBody from '@/widgets/community/ui/PostDetailBody';
import Horizon from '@/shared/ui/layout/Horizon';

const PostDetail = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center">
      <Header isShowPrev={true} children="자유게시판" empty={true} />
      <Horizon lineBold="thin" lineWidth="long" />
      <div className="w-[375px]">
        <div className="flex h-[calc(100vh-[66px]-80px)] w-full justify-center overflow-auto">
          <PostDetailBody />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
