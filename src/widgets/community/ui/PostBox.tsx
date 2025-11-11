import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTimeDiff } from '@/lib/utils/getTimeDiff';
import {
  fetchRecentCommunityPosts,
  CommunityPost
} from '@/lib/api/community';

const PostBox = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      try {
        const data = await fetchRecentCommunityPosts(200);
        if (isMounted) {
          setPosts(data);
        }
      } catch (err) {
        console.error('커뮤니티 게시물 불러오기 실패', err);
        if (isMounted) {
          setError('게시물을 불러오는 중 문제가 발생했습니다.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="py-10 text-center text-sm text-gray-500 md:px-8">
        게시물을 불러오는 중입니다...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center text-sm text-red-500 md:px-8">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-gray-500 md:px-8">
        아직 게시물이 없습니다.
      </div>
    );
  }

  return (
    <div className="md:px-8">
      {posts.map((item) => (
        <div key={item.id} className="w-full">
          <Link to={`/postdetail/${item.id}`}>
            <section className="relative mx-auto my-0 h-40 w-full bg-white px-2.5 pt-2.5 transition-all duration-300 hover:shadow-lg md:h-[180px] md:rounded-2xl">
              {getTimeDiff({ createdAt: item.created_at })}
              <h1 className="truncate pt-2 text-base text-black md:text-lg">
                {item.title}
              </h1>
              <span className="w-full pt-2 text-xs whitespace-normal text-gray-700 md:text-sm">
                {(item.content.length > 64 &&
                  item.content.slice(0, 64) + '...') ||
                  item.content}
              </span>
              <span className="text-gray-450 absolute bottom-3.5 block text-xs">
                #{item.tag ?? ''}
              </span>
            </section>
          </Link>
          <div className="mx-auto my-0 h-2.5 w-full border-t border-t-gray-300 bg-gray-200 md:h-4 md:max-w-full" />
        </div>
      ))}
    </div>
  );
};

export default PostBox;
