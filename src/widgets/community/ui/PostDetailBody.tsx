import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getTimeDiff } from '@/lib/utils/getTimeDiff';
import profile from '@/assets/profile.svg';
import {
  CommunityPost,
  fetchCommunityPostById
} from '@/lib/api/community';
import { fetchProfileById } from '@/lib/api/profile';

const PostDetailBody: React.FC = () => {
  const { id } = useParams();
  const [thisData, setThisData] = useState<CommunityPost | null>(null);
  const [authorAvatar, setAuthorAvatar] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (!id) return;
        const record = await fetchCommunityPostById(id);
        if (record) {
          setThisData(record);
          if (record.author_id) {
            const profileData = await fetchProfileById(record.author_id);
            setAuthorAvatar(profileData?.avatar_url ?? '');
          }
        } else {
          setThisData(null);
        }
      } catch (error) {
        console.error('자유게시판 글을 불러오지 못했습니다.', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  if (isLoading) return <div className="pt-5">로딩중...</div>;

  // 데이터가 없을 경우 예외 처리
  if (!thisData) return <div>게시글이 존재하지 않습니다.</div>;

  const { title, content: bodyText, tag, author_nickname, created_at } = thisData;
  const hashtags =
    tag
      ?.split(/\s+/)
      .filter(Boolean)
      .map((hash) => (hash.startsWith('#') ? hash : `#${hash}`)) ?? [];

  return (
    <div className="mx-auto w-full max-w-[430px] px-4 py-6 md:max-w-4xl md:py-8">
      <div className="rounded-3xl bg-white p-4 shadow-sm md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-gray-100 bg-white">
              <img
                src={authorAvatar || profile}
                alt="작성자"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1a1a1a]">{author_nickname}</p>
              <div className="text-xs text-[#999]">
                {getTimeDiff({ createdAt: created_at })}
              </div>
            </div>
          </div>
        </div>

        <h2 className="mb-4 text-base font-semibold text-[#1a1a1a] md:text-xl">{title}</h2>

        <div className="mb-6 whitespace-pre-wrap text-sm leading-6 text-[#1a1a1a] md:text-base">
          {bodyText}
        </div>

        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {hashtags.map((hashTag, index) => (
              <span key={`${hashTag}-${index}`} className="text-sm text-[#4F7EFF]">
                {hashTag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetailBody;
