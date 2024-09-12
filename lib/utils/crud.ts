import pb from "@/lib/api/getPbData";

export const getData = async (collection: string, options: object = {}) => {
  try {
    return pb.collection(collection).getFullList(options);
  } catch (error) {
    console.error('에러 발생: ', error);
  }
};

export const createData = async (collection: string, data: object) => {
  try {
    return pb.collection(collection).create(data);
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
    return pb.collection(collection).update(id, data);
  } catch (error) {
    console.error('에러 발생: ', error);
  }
};

export const deleteData = async (collection: string, id: string) => {
  try {
    return pb.collection(collection).delete(id);
  } catch (error) {
    console.error('에러 발생: ', error);
  }
};
