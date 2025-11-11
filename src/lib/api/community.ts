import { supabase } from '@/lib/api/supabaseClient';

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  tag: string | null;
  author_id: string | null;
  author_nickname: string | null;
  created_at: string;
  updated_at?: string;
}

const communityFields =
  'id, title, content, tag, author_id, author_nickname, created_at, updated_at';

export const fetchRecentCommunityPosts = async (
  limit: number = 10
): Promise<CommunityPost[]> => {
  const { data, error } = await supabase
    .from('community')
    .select(communityFields)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data ?? [];
};

export const searchCommunityPosts = async (keyword: string) => {
  const sanitized = keyword.trim().replace(/[,%]/g, '');
  if (!sanitized) {
    return [];
  }

  const { data, error } = await supabase
    .from('community')
    .select(communityFields)
    .or(
      `title.ilike.%${sanitized}%,content.ilike.%${sanitized}%,tag.ilike.%${sanitized}%`
    )
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
};

export const fetchCommunityPostById = async (id: string) => {
  const { data, error } = await supabase
    .from('community')
    .select(communityFields)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as CommunityPost | null;
};

export const createCommunityPost = async (
  payload: Pick<CommunityPost, 'title' | 'content' | 'tag'> & {
    author_id: string;
    author_nickname: string;
  }
) => {
  const { error } = await supabase.from('community').insert({
    title: payload.title,
    content: payload.content,
    tag: payload.tag,
    author_id: payload.author_id,
    author_nickname: payload.author_nickname
  });

  if (error) {
    throw error;
  }
};
