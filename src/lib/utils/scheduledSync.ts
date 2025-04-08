import { syncFindItems } from '@/lib/utils/syncFindItems';
import { syncLostItems } from '@/lib/utils/syncLostItems';
import { supabase } from '@/lib/supabaseClient';

/**
 * 주기적으로 백그라운드에서 데이터 동기화를 실행하는 스케줄러
 */
export class SyncScheduler {
  private static instance: SyncScheduler;
  private intervalId: NodeJS.Timeout | null = null;
  private syncInProgress = false;
  private syncInterval = 2 * 60 * 60 * 1000; // 2시간

  private constructor() {
    // 싱글톤 패턴을 위한, 생성자는 private
  }

  /**
   * 동기화 스케줄러의 싱글톤 인스턴스를 반환
   */
  public static getInstance(): SyncScheduler {
    if (!SyncScheduler.instance) {
      SyncScheduler.instance = new SyncScheduler();
    }
    return SyncScheduler.instance;
  }

  /**
   * 스케줄러 시작
   */
  public start() {
    // 이미 실행 중이면 중복 실행 방지
    if (this.intervalId) {
      console.log('동기화 스케줄러가 이미 실행 중입니다.');
      return;
    }

    console.log('동기화 스케줄러 시작');

    // 앱 시작 시 최초 1번 실행
    this.runSync();

    // 주기적으로 동기화 실행
    this.intervalId = setInterval(() => {
      this.runSync();
    }, this.syncInterval);
  }

  /**
   * 스케줄러 중지
   */
  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('동기화 스케줄러 중지');
    }
  }

  /**
   * 마지막 동기화 시간을 확인하고 필요한 경우 동기화 실행
   */
  private async runSync() {
    if (this.syncInProgress) {
      console.log('이미 동기화가 진행 중입니다.');
      return;
    }

    try {
      this.syncInProgress = true;

      // 습득물 동기화 상태 확인
      await this.checkAndSyncData('get_list', async () => {
        console.log('습득물 백그라운드 동기화 시작');
        const result = await syncFindItems(100);
        console.log(
          '습득물 백그라운드 동기화 결과:',
          result.success ? '성공' : '실패'
        );
        return result;
      });

      // 분실물 동기화 상태 확인
      await this.checkAndSyncData('lost_list', async () => {
        console.log('분실물 백그라운드 동기화 시작');
        const result = await syncLostItems(100);
        console.log(
          '분실물 백그라운드 동기화 결과:',
          result.success ? '성공' : '실패'
        );
        return result;
      });
    } catch (error) {
      console.error('백그라운드 동기화 오류:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * 특정 테이블의 동기화 상태를 확인하고 필요시 동기화 실행
   */
  private async checkAndSyncData(
    type: string,
    syncFn: () => Promise<{ success: boolean; count?: number; error?: any }>
  ) {
    try {
      // 마지막 동기화 시간 확인
      const { data } = await supabase
        .from('sync_status')
        .select('last_sync, status')
        .eq('type', type)
        .single();

      let shouldSync = true;

      if (data) {
        const lastSync = new Date(data.last_sync);
        const now = new Date();
        const diffHours =
          (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);

        // 마지막 동기화가 2시간 이내이고 성공한 경우에는 동기화 생략
        if (diffHours < 2 && data.status === 'success') {
          console.log(
            `${type} 마지막 동기화: ${lastSync.toLocaleString()} (${diffHours.toFixed(1)}시간 전). 동기화 생략.`
          );
          shouldSync = false;
        }
      }

      if (shouldSync) {
        return await syncFn();
      }

      return { success: true };
    } catch (error) {
      console.error(`${type} 동기화 상태 확인 오류:`, error);
      return { success: false, error };
    }
  }

  /**
   * 수동으로 동기화 실행
   */
  public async manualSync() {
    console.log('수동 동기화 요청됨');
    return this.runSync();
  }

  /**
   * 동기화 주기 설정 (밀리초)
   */
  public setSyncInterval(intervalMs: number) {
    if (intervalMs < 60000) {
      console.warn(
        '동기화 주기는 최소 1분 이상이어야 합니다. 1분으로 설정합니다.'
      );
      intervalMs = 60000;
    }

    this.syncInterval = intervalMs;

    // 이미 실행 중이라면 재시작
    if (this.intervalId) {
      this.stop();
      this.start();
    }

    console.log(
      `동기화 주기가 ${intervalMs / (60 * 1000)}분으로 설정되었습니다.`
    );
  }
}
