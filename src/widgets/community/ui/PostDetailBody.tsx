import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getData } from '@/lib/utils/crud';
import { getTimeDiff } from '@/lib/utils/getTimeDiff';
import getPbImgURL from '@/lib/utils/getPbImgURL';
import profile from '@/assets/profile.svg';

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  tag: string;
  nickname: string;
  created: string; // ISO timestamp string
}

interface UserRecord {
  id: string;
  avatar?: string;
}

const PostDetailBody: React.FC = () => {
  const { id } = useParams();
  const [thisData, setThisData] = useState<CommunityPost | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [userAvatar, setUserAvatar] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const records = await getData<CommunityPost>('community', {
          filter: `id="${id}"`
        });
        if (records && records.length > 0) {
          setThisData(records[0]);

          const userRecords = await getData<UserRecord>('users', {
            filter: `nickname="${records[0].nickname}"`
          });

          const realData = userRecords && userRecords[0];
          if (realData) {
            setUserId(realData.id);
            setUserAvatar(realData.avatar ?? '');
          }
        } else {
          setThisData(null);
        }
      } catch (error) {
        console.error('자유게시판 pb > id 검색 에러', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  if (isLoading) return <div className="pt-5">로딩중...</div>;

  // 데이터가 없을 경우 예외 처리
  if (!thisData) return <div>게시글이 존재하지 않습니다.</div>;

  const { title, content: bodyText, tag, nickname, created } = thisData;

  return (
    <div className="w-[315px]">
      <section className="flex items-center gap-2 pt-5">
        <img
          src={
            (userAvatar !== '' && getPbImgURL(userId, userAvatar)) || profile
          }
          alt="글쓴이 프로필 사진"
          className="size-8.5 rounded-full"
        />
        <div className="flex flex-col text-xs">
          <span className="text-sm">{nickname}</span>
          {getTimeDiff({ createdAt: created })}
        </div>
      </section>

      <section className="flex flex-col pt-5">
        <h1 className="text-2xl tracking-tight text-black">{title}</h1>
        <p className="w-full pt-2.5 text-base leading-7 tracking-tight break-keep whitespace-normal text-gray-700">
          {bodyText}
        </p>
        <span className="text-primary block pt-7.5 text-sm tracking-tight">
          #{tag}
        </span>
      </section>
    </div>
  );
};

export default PostDetailBody;
