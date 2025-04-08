import { supabase } from '@/lib/api/supabase';

export const getData = async (collection: string, options: object = {}) => {
  try {
    const { data, error } = await supabase
      .from(collection)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('에러 발생: ', error);
  }
};

export const createData = async (collection: string, data: object) => {
  try {
    // 현재 시간을 한국 시간(UTC+9)으로 생성
    const now = new Date();
    // 타임스탬프에 명시적으로 '+09:00' 추가 (한국 시간)
    const koreanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const timestamp = koreanTime.toISOString();
    console.log('생성된 타임스탬프:', timestamp);

    // 기존 데이터에 타임스탬프 추가
    const dataWithTimestamp = {
      ...data,
      created_at: timestamp,
      updated_at: timestamp,
    };

    const { data: insertedData, error } = await supabase
      .from(collection)
      .insert(dataWithTimestamp)
      .select();

    if (error) throw error;
    return insertedData[0];
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
    const { data: updatedData, error } = await supabase
      .from(collection)
      .update(data)
      .eq('id', id)
      .select();

    if (error) throw error;
    return updatedData[0];
  } catch (error) {
    console.error('에러 발생: ', error);
  }
};

export const deleteData = async (collection: string, id: string) => {
  try {
    const { error } = await supabase.from(collection).delete().eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('에러 발생: ', error);
  }
};
