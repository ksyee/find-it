import { supabase } from '@/lib/api/supabaseClient';

export interface Profile {
  id: string;
  email: string | null;
  nickname: string | null;
  state: string | null;
  city: string | null;
  keywords: string | null;
  avatar_url: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

const profileFields =
  'id, email, nickname, state, city, keywords, avatar_url, created_at, updated_at';

export const fetchProfileById = async (id: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(profileFields)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as Profile | null;
};

export const fetchProfileByNickname = async (nickname: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(profileFields)
    .eq('nickname', nickname);

  if (error) {
    throw error;
  }

  return data as Profile[];
};

export const upsertProfile = async (
  id: string,
  payload: Partial<Omit<Profile, 'id'>>
) => {
  const { error } = await supabase.from('profiles').upsert(
    {
      id,
      ...payload
    },
    { onConflict: 'id' }
  );

  if (error) {
    throw error;
  }
};

export const updateProfile = async (
  id: string,
  payload: Partial<Omit<Profile, 'id'>>
) => {
  const { error } = await supabase.from('profiles').update(payload).eq('id', id);
  if (error) {
    throw error;
  }
};
