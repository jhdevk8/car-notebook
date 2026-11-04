// 저장소에서 난 오류를 화면에 보여 줄 문구로 바꾼다.
export const toRepositoryError = (error) => {
  const text = `${error?.message ?? ''}`;

  if (error?.code === '23505') return new Error('이 날짜에는 이미 기록이 있어요.');
  if (error?.code === '23514') return new Error('주행거리는 0 이상이어야 해요.');
  if (error?.code === '42P01' || error?.code === 'PGRST205') {
    return new Error('Supabase에 테이블이 없어요. supabase/schema.sql을 실행해 주세요.');
  }
  if (error?.code === 'PGRST301' || error?.code === 'PGRST303' || /jwt/i.test(text)) {
    return new Error('로그인이 만료됐어요. 다시 로그인해 주세요.');
  }
  if (/fetch|network/i.test(text)) {
    return new Error('서버에 연결하지 못했어요. 인터넷을 확인하고 다시 시도해 주세요.');
  }
  return new Error('저장소 처리에 실패했어요. 잠시 후 다시 시도해 주세요.');
};
