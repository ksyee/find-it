import { getPocketBaseUrl } from '@/lib/utils/getPocketBaseUrl';

const getPbImgURL = (id: string, fileName: string) => {
  const baseUrl = getPocketBaseUrl().replace(/\/+$/, '');

  return `${baseUrl}/api/files/users/${id}/${fileName}`;
};

export default getPbImgURL;
