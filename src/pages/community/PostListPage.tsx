import { Link } from 'react-router-dom';
import Header from '@/widgets/header/ui/Header';
import PostBox from '@/widgets/community/ui/PostBox';
import IconPlus from '@/assets/icons/icon_plus.svg';

import Horizon from '@/shared/ui/layout/Horizon';

const PostList = () => {
  const loginUserData = localStorage.getItem('pocketbase_auth');

  return (
    <div className="flex h-screen w-full flex-col items-center">
      <Header
        isShowSymbol={true}
        children="자유게시판"
        isShowSearch={true}
        link="/searchpost"
      />
      <Horizon lineBold="bold" lineWidth="long" />
      <div className="relative w-full max-w-[375px] md:max-w-[768px] lg:max-w-[1280px]">
        <div className="h-[calc(100vh-[66px]-80px)] overflow-auto lg:h-[calc(100vh-138px)]">
          <PostBox />
        </div>
        {loginUserData && (
          <Link to="/createpost">
            <img
              src={IconPlus}
              alt="글쓰기 버튼"
              className="absolute bottom-[18px] right-[30px] z-10 size-60px drop-shadow-xl hover:animate-bounce"
            />
          </Link>
        )}
      </div>

    </div>
  );
};

export default PostList;
