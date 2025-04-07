import { supabase } from '@/lib/api/supabase';

interface UserData {
  name?: string;
  avatar_url?: string;
  [key: string]: string | number | boolean | null | undefined;
}

// 로그인 함수
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('로그인 에러:', error);
    throw error;
  }
};

// 회원가입 함수
export const signUp = async (
  email: string,
  password: string,
  userData: UserData
) => {
  try {
    // 사용자 계정 생성
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // 추가 사용자 데이터 저장
    if (authData.user) {
      const { error: profileError } = await supabase.from('users').insert({
        id: authData.user.id,
        ...userData,
      });

      if (profileError) throw profileError;
    }

    return authData;
  } catch (error) {
    console.error('회원가입 에러:', error);
    throw error;
  }
};

// 로그아웃 함수
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('로그아웃 에러:', error);
    throw error;
  }
};

// 현재 사용자 정보 가져오기
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error('사용자 정보 조회 에러:', error);
    return null;
  }
};

// 사용자 세션 가져오기
export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error('세션 조회 에러:', error);
    return null;
  }
};
