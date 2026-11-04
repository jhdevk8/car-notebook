import DeleteButton from '../../components/ui/DeleteButton.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { formatDate, formatKm } from '../../utils/format.js';
import { buildRows } from '../../utils/mileage.js';

export default function MileageTable({ logs, onDelete }) {
  if (logs.length === 0) {
    return <EmptyState>날짜와 계기판 숫자를 입력하면 여기에 쌓여요.</EmptyState>;
  }

  return (
    <div className="table-scroll">
      <table className="log-table">
        <thead>
          <tr>
            <th scope="col">날짜</th>
            <th scope="col">계기판</th>
            <th scope="col">기간</th>
            <th scope="col">주행</th>
            <th scope="col">하루 평균</th>
            <th scope="col">
              <span className="sr-only">삭제</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {buildRows(logs).map(({ id, date, km, interval }) => (
            <tr key={id}>
              <td className="cell-date">{formatDate(date)}</td>
              <td data-label="계기판">{formatKm(km)}</td>
              <td data-label="기간">{interval ? `${interval.days}일` : '시작'}</td>
              <td className="cell-strong" data-label="주행">{interval ? `+${formatKm(interval.km)}` : '–'}</td>
              <td data-label="하루 평균">{interval ? formatKm(interval.perDay) : '–'}</td>
              <td className="cell-delete">
                <DeleteButton label={`${formatDate(date)} 기록`} onDelete={() => onDelete(id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
