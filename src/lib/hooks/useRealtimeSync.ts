import { useEffect } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

export function useRealtimeSync(onUpdate: () => void) {
  useEffect(() => {
    let channel: RealtimeChannel;

    const setupSubscription = async () => {
      // 실시간 채널 생성
      channel = supabase.channel('get_list_changes');

      // sync_status 테이블 구독
      channel
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'sync_status',
            filter: 'type=eq.get_list',
          },
          (payload) => {
            if (payload.new.status === 'success') {
              // 동기화가 성공적으로 완료되면 콜백 실행
              onUpdate();
            }
          }
        )
        .subscribe();
    };

    setupSubscription();

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [onUpdate]);
}
