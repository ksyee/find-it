import { useEffect, useRef, useState } from 'react';
import { createCommunityPost } from '@/lib/api/community';
import { fetchProfileById } from '@/lib/api/profile';
import { Hash } from 'lucide-react';
import { supabase } from '@/lib/api/supabaseClient';
import { useHeaderConfig } from '@/widgets/header/model/HeaderConfigContext';
import { logger } from '@/lib/utils/logger';

const formatHashtags = (value: string) =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`))
    .join(' ');

const CreatePost = () => {
  const [submit, setSubmit] = useState(false);
  const [titleValue, setTitleValue] = useState('');
  const [bodyValue, setBodyValue] = useState('');
  const [hashtagValue, setHashtagValue] = useState('');
  const [selectedCategory] = useState('자유게시판');
  const [userNickname, setUserNickname] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) return;
      setUserId(user.id);

      try {
        const profileData = await fetchProfileById(user.id);
        if (profileData?.nickname) {
          setUserNickname(profileData.nickname);
        } else if (user.email) {
          setUserNickname(user.email);
        }
      } catch (error) {
        logger.error('사용자 정보를 불러오지 못했습니다.', error);
      }
    };

    void loadUser();
  }, []);

  useEffect(() => {
    const isReady =
      titleValue.trim() !== '' &&
      bodyValue.trim() !== '' &&
      hashtagValue.trim() !== '';
    setSubmit(isReady);
  }, [titleValue, bodyValue, hashtagValue]);

  const formRef = useRef<HTMLFormElement | null>(null);

  const buttonSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId || !userNickname) {
      alert('로그인 후 이용해주세요.');
      return;
    }

    const normalizedHashtags = formatHashtags(hashtagValue);

    await createCommunityPost({
      title: titleValue,
      content: bodyValue,
      tag: normalizedHashtags,
      author_id: userId,
      author_nickname: userNickname
    });
    window.location.href = '/postlist';
  };

  useHeaderConfig(
    () => ({
      isShowPrev: true,
      children: '글쓰기',
      empty: true
    }),
    []
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-col">
          <div className="w-full">
            <form ref={formRef} onSubmit={buttonSubmit}>
              <div className="space-y-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex flex-col gap-6 p-6">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600">
                      {selectedCategory}
                    </span>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="제목을 입력하세요"
                      value={titleValue}
                      onChange={(e) => setTitleValue(e.target.value)}
                      className="w-full border-0 border-b border-gray-200 px-0 text-lg font-medium focus:border-blue-600 focus:outline-none"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      이야기하고 싶은 내용을 간단히 표현해주세요.
                    </p>
                  </div>

                  <div>
                    <textarea
                      placeholder="내용을 입력하세요..."
                      value={bodyValue}
                      onChange={(e) => setBodyValue(e.target.value)}
                      className="min-h-[400px] w-full resize-none border-0 bg-transparent p-0 text-sm leading-6 focus:outline-none"
                    />
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <span>내용을 자세히 작성할수록 도움을 줄 수 있어요.</span>
                      <span>{bodyValue.length} / 5000자</span>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Hash className="h-4 w-4 text-gray-400" />
                      해시태그
                    </label>
                    <input
                      type="text"
                      placeholder="해시태그를 입력하세요"
                      value={hashtagValue}
                      onChange={(e) => setHashtagValue(e.target.value)}
                      className="w-full border-0 border-b border-gray-200 px-0 py-2 text-sm focus:border-blue-600 focus:outline-none"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      공백으로 여러 개의 태그를 구분할 수 있습니다.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-sm text-blue-600">
                      {formatHashtags(hashtagValue)
                        .split(' ')
                        .filter(Boolean)
                        .map((tag, index) => (
                          <span key={`${tag}-${index}`}>{tag}</span>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div />
                  <button
                    type="submit"
                    disabled={!submit}
                    className={`rounded-full px-5 py-2 text-sm font-semibold text-white transition-colors ${
                      submit ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300'
                    }`}
                  >
                    게시하기
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
