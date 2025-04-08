import { supabase } from '@/lib/api/supabase';

/**
 * 프로필 이미지 업로드 함수
 * @param file 업로드할 이미지 파일
 * @param userId 사용자 ID
 * @returns 업로드된 파일명 또는 null(실패시)
 */
export const uploadProfileImage = async (
  file: File,
  userId: string
): Promise<string | null> => {
  try {
    // 1. 파일 확장자 추출
    const fileExt = file.name.split('.').pop();

    // 2. 파일명 생성 (userId-타임스탬프.확장자)
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    console.log('생성된 파일명:', fileName);

    // 3. avatars 버킷에 파일 업로드
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true, // 기존 파일 덮어쓰기
      });

    if (uploadError) {
      console.error('파일 업로드 오류:', uploadError);
      throw uploadError;
    }

    console.log('파일 업로드 성공:', uploadData);

    // 4. 업로드된 파일의 URL 가져오기
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    const imageUrl = urlData.publicUrl;
    console.log('생성된 이미지 URL:', imageUrl);

    // 5. users 테이블의 avatar 필드에 전체 URL 업데이트
    const { data: userData, error: updateError } = await supabase
      .from('users')
      .update({
        avatar: imageUrl, // 전체 URL 저장
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select();

    if (updateError) {
      console.error('사용자 테이블 업데이트 오류:', updateError);
      throw updateError;
    }

    console.log('사용자 테이블 업데이트 결과:', userData);

    // 6. auth.users 메타데이터에도 전체 URL 업데이트
    const { data: authData, error: authError } = await supabase.auth.updateUser(
      {
        data: { avatar_url: imageUrl },
      }
    );

    if (authError) {
      console.error('인증 메타데이터 업데이트 오류:', authError);
      throw authError;
    }

    console.log('인증 메타데이터 업데이트 결과:', authData);

    // 7. 세션 스토리지의 캐시된 URL 업데이트
    sessionStorage.setItem('user_avatar_url', imageUrl);
    console.log('세션 스토리지 캐시 업데이트:', imageUrl);

    return fileName;
  } catch (error) {
    console.error('이미지 업로드 전체 오류:', error);
    return null;
  }
};

/**
 * 이미지 URL 생성 함수
 * @param fileName 저장된 파일명
 * @returns 이미지 URL 또는 기본 이미지 URL
 */
export const getProfileImageUrl = (fileName: string | null): string => {
  if (!fileName) return '/assets/profile.svg'; // 기본 이미지 경로

  const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);

  return data.publicUrl;
};
