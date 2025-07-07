import { pb } from '@/lib/api/getPbData';

export const getData = async <T = Record<string, unknown>>(collection: string, options: object = {}): Promise<T[]> => {
  try {
    // PocketBase returns RecordModel[] by default; let caller specify expected type
    const response = (await pb.collection(collection).getFullList(options)) as unknown as T[];
    return response;
  } catch (error) {
    console.error('에러 발생: ', error);
    return [] as T[]; // fallback on error, keeps return type consistent
  }
};

export const createData = async (collection: string, data: object) => {
  try {
    const response = pb.collection(collection).create(data);

    return response;
  } catch (error) {
    console.error('에러 발생: ', error);
  }
};

export const updateData = async (
  collection: string,
  id: string,
  data: object
) => {
  try {
    const response = pb.collection(collection).update(id, data);

    return response;
  } catch (error) {
    console.error('에러 발생: ', error);
  }
};

export const deleteData = async (collection: string, id: string) => {
  try {
    const response = pb.collection(collection).delete(id);

    return response;
  } catch (error) {
    console.error('에러 발생: ', error);
  }
};
