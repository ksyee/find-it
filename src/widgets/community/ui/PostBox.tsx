import { Link } from "react-router-dom";
import { getData } from "@/lib/utils/crud";
import { getTimeDiff } from "@/lib/utils/getTimeDiff";

// 커뮤니티 글 타입 정의
interface CommunityPost {
  id: string;
  created: string;
  title: string;
  content: string;
  tag: string;
}

// pb 데이터 뿌리기
const data: CommunityPost[] = await getData<CommunityPost>("community", { sort: "-created" });

const PostBox = () => {
  return (
    <div className="lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-4 lg:p-5">
      {data.map((item: CommunityPost, index: number) => (
        <div key={item.id} className="w-full">
          <Link to={`/postdetail/${item.id}`}>
            <section className="relative mx-auto my-0 h-[160px] w-[335px] bg-white px-[10px] pt-[10px] lg:w-full lg:h-[180px] lg:rounded-2xl hover:shadow-lg transition-all duration-300">
              {getTimeDiff({ createdAt: data[index].created })}
              <h1 className="truncate pt-[8px] text-base text-black lg:text-lg">
                {item.title}
              </h1>
              <span className="w-full whitespace-normal pt-[8px] text-xs text-gray-700 lg:text-sm">
                {(item.content.length > 64 &&
                  item.content.slice(0, 64) + "...") ||
                  item.content}
              </span>
              <span className="absolute bottom-[14px] block text-xs text-gray-450">
                #{item.tag}
              </span>
            </section>
          </Link>
          <div className="mx-auto my-0 h-[10px] w-full max-w-[400px] border-t border-t-gray-300 bg-gray-200 lg:hidden" />
        </div>
      ))}
    </div>
  );
};

export default PostBox;
