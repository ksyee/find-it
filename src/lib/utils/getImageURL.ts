/**
 * Supabase Storage 버킷에 저장된 이미지의 URL을 생성합니다.
 * @param bucketName Storage 버킷 이름 (예: 'avatars')
 * @param path 이미지 경로 또는 파일명
 * @returns 이미지의 공개 URL
 */
const getImageURL = (bucketName: string, path: string): string => {
  if (!path) {
    console.warn('getImageURL: 경로가 제공되지 않았습니다.');
    return ''; // 빈 문자열 반환
  }

  // 이미 전체 URL인 경우 그대로 반환
  if (path.startsWith('http')) {
    return path;
  }

  // 공백이나 특수 문자가 있는 경우 인코딩
  const encodedPath = encodeURIComponent(path);

  const url = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${encodedPath}`;
  console.log(`getImageURL: ${url}`);
  return url;
};

export default getImageURL;
