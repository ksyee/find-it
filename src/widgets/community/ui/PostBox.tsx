import { Link } from 'react-router-dom';
import { getData } from '@/lib/utils/crud';
import { getTimeDiff } from '@/lib/utils/getTimeDiff';

// 커뮤니티 글 타입 정의
interface CommunityPost {
  id: string;
  created: string;
  title: string;
  content: string;
  tag: string;
}

// pb 데이터 뿌리기
const data: CommunityPost[] = await getData<CommunityPost>('community', {
  sort: '-created'
});

const PostBox = () => {
  return (
    <div className="md:p-5 md:px-8">
      {data.map((item: CommunityPost, index: number) => (
        <div key={item.id} className="w-full">
          <Link to={`/postdetail/${item.id}`}>
            <section className="relative mx-auto my-0 h-[160px] w-full bg-white px-[10px] pt-[10px] transition-all duration-300 hover:shadow-lg md:h-[180px] md:rounded-2xl">
              {getTimeDiff({ createdAt: data[index].created })}
              <h1 className="truncate pt-[8px] text-base text-black md:text-lg">
                {item.title}
              </h1>
              <span className="w-full pt-[8px] text-xs whitespace-normal text-gray-700 md:text-sm">
                {(item.content.length > 64 &&
                  item.content.slice(0, 64) + '...') ||
                  item.content}
              </span>
              <span className="text-gray-450 absolute bottom-[14px] block text-xs">
                #{item.tag}
              </span>
            </section>
          </Link>
          <div className="mx-auto my-0 h-[10px] w-full border-t border-t-gray-300 bg-gray-200 md:h-[16px] md:max-w-full" />
        </div>
      ))}
    </div>
  );
};

export default PostBox;
