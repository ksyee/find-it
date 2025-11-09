import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { pb } from '@/lib/api/getPbData';
import { getTimeDiff } from '@/lib/utils/getTimeDiff';

interface CommunityPost {
  id: string;
  created: string;
  title: string;
  content: string;
  tag: string;
}

const Sidebar = () => {
  // 최근 게시물 가져오기
  const { data: posts } = useQuery({
    queryKey: ['recentPosts'],
    queryFn: async () => {
      const res = await pb
        .collection('community')
        .getList(1, 5, { sort: '-created' });
      return res.items as unknown as CommunityPost[];
    },
    staleTime: 1000 * 60 * 5
  });

  return (
    <aside className="sidebar-desktop bg-gray-100 h-[calc(100vh-72px)] sticky top-[72px] overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* 검색 섹션 */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Search</h2>
          <div className="space-y-3">
            <Link
              to="/searchfind"
              className="block w-full bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-3 text-sm font-medium transition-colors"
            >
              습득물 찾기
            </Link>
            <Link
              to="/searchlost"
              className="block w-full bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-3 text-sm font-medium transition-colors"
            >
              분실물 찾기
            </Link>
          </div>
        </section>

        {/* Lost Items 섹션 */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Lost Items</h2>
            <Link to="/lostlist" className="text-sm text-primary hover:underline">
              전체보기
            </Link>
          </div>
          <p className="text-sm text-gray-600">
            분실물을 등록하고 찾아보세요.
          </p>
        </section>

        {/* Community Board 섹션 */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Community Board</h2>
            <Link to="/postlist" className="text-sm text-primary hover:underline">
              전체보기
            </Link>
          </div>

          {posts && posts.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Recent Posts</h3>
              <ul className="space-y-2">
                {posts.map((post) => (
                  <li key={post.id}>
                    <Link
                      to={`/postdetail/${post.id}`}
                      className="block hover:bg-gray-50 rounded-lg p-2 transition-colors"
                    >
                      <p className="text-sm font-medium truncate text-gray-900">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {getTimeDiff({ createdAt: post.created })}
                        </span>
                        <span className="text-xs text-gray-400">
                          #{post.tag}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              아직 게시물이 없습니다.
            </p>
          )}
        </section>
      </div>
    </aside>
  );
};

export default Sidebar;
