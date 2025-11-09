import { useEffect, useState } from 'react';
import { createData } from '@/lib/utils/crud';
import Header from '@/widgets/header/ui/Header';
import CreateBodyText from '@/widgets/community/ui/CreateBodyText';
import Horizon from '@/shared/ui/layout/Horizon';

// 1. 유저 닉네임 전달
// 2 제목, 시간, 내용 ,해시태그 전달

/* -------------------------------------------------------------------------- */
const CreatePost = () => {
  const [submit, setSubmit] = useState(false);
  const [titleValue, setTitleValue] = useState('');
  const [tagValue, setTagValue] = useState('');
  const [bodyValue, setBodyValue] = useState('');
  const [userNickname, setUserNickname] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const loginUserData = window.localStorage.getItem('pocketbase_auth');
      if (!loginUserData) return;

      const localData = JSON.parse(loginUserData);
      const nickname = localData?.model?.nickname;
      if (typeof nickname === 'string') {
        setUserNickname(nickname);
      }
    } catch (error) {
      console.warn('Failed to read user data', error);
    }
  }, []);

  // 값 입력
  const receiveTitleValue = (value: string) => {
    setTitleValue(value);
  };
  const receiveTagValue = (value: string) => {
    setTagValue(value);
  };
  const receiveBodyValue = (value: string) => {
    setBodyValue(value);
  };

  // 글 데이터
  interface NewPostData {
    nickname?: string;
    title: string;
    content: string;
    tag: string;
  }

  const newPostData: NewPostData = {
    nickname: userNickname || undefined,
    title: titleValue,
    content: bodyValue,
    tag: tagValue
  };

  // 완료 조건
  useEffect(() => {
    if (titleValue !== '' && bodyValue !== '' && tagValue !== '') {
      setSubmit(true);
    } else {
      setSubmit(false);
    }
  }, [titleValue, bodyValue, tagValue]);

  //완료 버튼
  const buttonSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createData('community', newPostData);
    window.location.href = '/postlist';
  };

  return (
    <>
      <form
        className="flex w-full flex-col items-center justify-center"
        onSubmit={buttonSubmit}
      >
        <Header isShowPrev={true} children="글쓰기" isShowSubmit={!!submit} />
        <Horizon lineBold="thin" lineWidth="long" />

        <CreateBodyText
          titleValue={titleValue}
          onChangeTitle={receiveTitleValue}
          tagValue={tagValue}
          onChangeTag={receiveTagValue}
          bodyValue={bodyValue}
          onChangeBody={receiveBodyValue}
        />
      </form>
    </>
  );
};

export default CreatePost;
