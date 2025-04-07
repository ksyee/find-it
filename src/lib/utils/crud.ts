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
    const { data: insertedData, error } = await supabase
      .from(collection)
      .insert(data)
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
