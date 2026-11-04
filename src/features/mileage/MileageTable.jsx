import DeleteButton from '../../components/ui/DeleteButton.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { formatDate, formatKm } from '../../utils/format.js';
import { buildRows } from '../../utils/mileage.js';

const HEAD = 'px-2 py-2.5 text-right text-[0.8rem] font-medium text-muted';
const CELL = 'whitespace-nowrap sm:table-cell sm:border-t sm:border-line sm:px-2 sm:py-2.5 sm:text-right';
// 폰에서는 표 머리글이 숨겨져서, 칸마다 data-label을 작은 제목으로 보여 준다.
const LABELED = `${CELL} before:block before:text-[0.8rem] before:font-normal before:text-muted before:content-[attr(data-label)] sm:before:hidden`;

export default function MileageTable({ logs, onDelete }) {
  if (logs.length === 0) {
    return <EmptyState>날짜와 계기판 숫자를 입력하면 여기에 쌓여요.</EmptyState>;
  }

  return (
    <table className="block w-full border-collapse tabular-nums sm:table">
      <thead className="sr-only sm:not-sr-only sm:table-header-group">
        <tr>
          <th scope="col" className={`${HEAD} pl-0 text-left`}>
            날짜
          </th>
          <th scope="col" className={HEAD}>
            계기판
          </th>
          <th scope="col" className={HEAD}>
            기간
          </th>
          <th scope="col" className={HEAD}>
            주행
          </th>
          <th scope="col" className={HEAD}>
            하루 평균
          </th>
          <th scope="col" className={HEAD}>
            <span className="sr-only">삭제</span>
          </th>
        </tr>
      </thead>
      <tbody className="block sm:table-row-group">
        {buildRows(logs).map(({ id, date, km, interval }) => (
          <tr key={id} className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-line py-3 sm:table-row sm:p-0">
            <td className={`${CELL} self-center font-bold sm:pl-0 sm:text-left sm:font-normal`}>{formatDate(date)}</td>
            <td className={LABELED} data-label="계기판">
              {formatKm(km)}
            </td>
            <td className={LABELED} data-label="기간">
              {interval ? `${interval.days}일` : '시작'}
            </td>
            <td className={`${LABELED} font-bold text-accent`} data-label="주행">
              {interval ? `+${formatKm(interval.km)}` : '–'}
            </td>
            <td className={LABELED} data-label="하루 평균">
              {interval ? formatKm(interval.perDay) : '–'}
            </td>
            <td className={`${CELL} col-start-2 row-start-1 text-right`}>
              <DeleteButton label={`${formatDate(date)} 기록`} onDelete={() => onDelete(id)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
