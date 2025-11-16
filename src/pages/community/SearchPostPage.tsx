import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { getTimeDiff } from '@/lib/utils/getTimeDiff';
import Horizon from '@/shared/ui/layout/Horizon';
import {
  searchCommunityPosts,
  CommunityPost
} from '@/lib/api/community';
import { useHeaderConfig } from '@/widgets/header/model/HeaderConfigContext';
import { logger } from '@/lib/utils/logger';

const SearchPost = () => {
  const [inputValue, setInputValue] = useState('');
  const [data, setData] = useState<CommunityPost[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showNoResult, setShowNoResult] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const thisValue = e.target.value;
    setInputValue(thisValue);
  };

  const submitInput = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (inputValue.trim() !== '') {
        const sanitizedInput = inputValue.trim().replace(/"/g, '\\"');
        const data = await searchCommunityPosts(sanitizedInput);
        setData(data);
        setInputValue('');
        setShowNoResult(data.length === 0);
      } else {
        setData([]);
        setShowNoResult(false);
      }
    } catch (error) {
      logger.error('게시물 검색 통신 에러', error);
    }
  };
  const SearchResult = (
    <>
      {data.map((item: CommunityPost, index: number) => (
        <div key={item.id} className="w-full">
          <Link to={`/postdetail/${item.id}`}>
            <section className="relative mx-auto my-0 h-40 w-full max-w-3xl px-4 pt-2.5">
              {getTimeDiff({ createdAt: data[index].created_at })}
              <h1 className="truncate pt-2 text-base text-black">
                {item.title}
              </h1>
              <span className="w-full pt-2 text-xs whitespace-normal text-gray-700">
                {(item.content.length > 64 &&
                  item.content.slice(0, 64) + '...') ||
                  item.content}
              </span>
              <span className="text-gray-450 absolute bottom-3.5 block text-xs">
                #{item.tag ?? ''}
              </span>
            </section>
          </Link>
          <div className="mx-auto my-0 h-2.5 w-full border-t border-t-gray-300 bg-gray-200" />
        </div>
      ))}
    </>
  );

  const NoResult = (
    <div className="pt-5 text-center">검색 결과가 없습니다.</div>
  );
  useHeaderConfig(
    () => ({
      isShowPrev: true,
      children: '게시물 검색',
      empty: true
    }),
    []
  );

  return (
    <div className="fixed inset-0 flex flex-col bg-white">
      <Horizon lineBold="bold" lineWidth="long" />

      <div className="mx-auto w-full max-w-7xl flex-1 overflow-auto">
        <form
          className="flex items-center justify-center px-4 py-4"
          onSubmit={submitInput}
        >
          <input
            ref={inputRef}
            type="search"
            value={inputValue}
            onChange={inputChange}
            className="w-full max-w-md appearance-none rounded-full px-5 py-2 text-base outline-none"
            style={{ border: '1px solid #bcbcbc' }}
            placeholder="검색어 입력 후 Enter"
          />
        </form>

        <div className="w-full pb-20 md:pb-8">
          {data.length > 0 ? SearchResult : showNoResult && NoResult}
        </div>
      </div>
    </div>
  );
};

export default SearchPost;
