import { Link } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';
import PostBox from '@/widgets/community/ui/PostBox';
import IconPlus from '@/assets/icons/icon_plus.svg';
import { getTimeDiff } from '@/lib/utils/getTimeDiff';
import SearchBar from '@/shared/ui/SearchBar';
import Horizon from '@/shared/ui/layout/Horizon';
import { searchCommunityPosts, CommunityPost } from '@/lib/api/community';
import { supabase } from '@/lib/api/supabaseClient';
import { useHeaderConfig } from '@/widgets/header/model/HeaderConfigContext';

const PostList = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [desktopQuery, setDesktopQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CommunityPost[] | null>(
    null
  );
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleDesktopSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = desktopQuery.trim();

    if (!trimmedQuery) {
      setSearchResults(null);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    const sanitizedQuery = trimmedQuery.replace(/"/g, '\\"');
    try {
      const data = await searchCommunityPosts(sanitizedQuery);
      setSearchResults(data);
    } catch (error) {
      console.error('게시물 검색 오류', error);
      setSearchError(
        '검색 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
      );
    } finally {
      setIsSearching(false);
    }
  };

  const resetSearch = () => {
    setDesktopQuery('');
    setSearchResults(null);
    setSearchError(null);
  };

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };

    void fetchSession();
  }, []);

  useHeaderConfig(
    () => ({
      isShowSymbol: true,
      children: '자유게시판'
    }),
    []
  );

  return (
    <div className="flex w-full flex-col items-center bg-white">
      <div className="w-full flex-1">
        <Horizon lineBold="bold" lineWidth="long" />
        <div className="w-full border-b border-gray-100 px-5 py-4 md:py-6">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">
            {searchResults && (
              <div className="flex justify-end pb-2">
                <button
                  type="button"
                  onClick={resetSearch}
                  className="text-sm text-[#4F7EFF] hover:underline"
                >
                  검색 초기화
                </button>
              </div>
            )}
            <SearchBar
              value={desktopQuery}
              onChange={setDesktopQuery}
              onSubmit={handleDesktopSearch}
              placeholder="검색어를 입력해주세요"
              disabled={isSearching}
            />
            {searchError && (
              <p className="pt-2 text-sm text-red-500">{searchError}</p>
            )}
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-7xl pb-20">
            {isSearching && (
              <p className="py-10 text-center text-sm text-gray-500">
                검색 중입니다...
              </p>
            )}
            {!isSearching && searchResults ? (
              searchResults.length > 0 ? (
                <div className="md:px-8">
                  {searchResults.map((item) => (
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
              ) : (
                <p className="py-10 text-center text-sm text-gray-500">
                  검색 결과가 없습니다.
                </p>
              )
            ) : (
              !isSearching && <PostBox />
            )}
          {isLoggedIn && (
            <Link
              to="/createpost"
              className="fixed right-5 bottom-[calc(var(--app-nav-bottom)+24px)] z-20 md:right-10 md:bottom-10"
              aria-label="글쓰기"
            >
              <img
                src={IconPlus}
                alt="글쓰기 버튼"
                className="size-60px drop-shadow-xl hover:animate-bounce"
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostList;
