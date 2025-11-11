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

  return (
    <div className="w-[315px]">
      <section className="flex items-center gap-2 pt-5">
        <img
          src={authorAvatar || profile}
          alt="글쓴이 프로필 사진"
          className="size-8.5 rounded-full"
        />
        <div className="flex flex-col text-xs">
          <span className="text-sm">{author_nickname}</span>
          {getTimeDiff({ createdAt: created_at })}
        </div>
      </section>

      <section className="flex flex-col pt-5">
        <h1 className="text-2xl tracking-tight text-black">{title}</h1>
        <p className="w-full pt-2.5 text-base leading-7 tracking-tight break-keep whitespace-normal text-gray-700">
          {bodyText}
        </p>
        <span className="text-primary block pt-7.5 text-sm tracking-tight">
          #{tag ?? ''}
        </span>
      </section>
    </div>
  );
};

export default PostDetailBody;
