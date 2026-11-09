import { Link } from 'react-router-dom';
import ModelStage from '../components/ModelStage.jsx';
import Odometer from '../components/Odometer.jsx';
import Icon from '../components/ui/Icon.jsx';
import VehicleNameField from '../features/home/VehicleNameField.jsx';
import { getCurrentKm } from '../utils/mileage.js';

export default function Home({ data, onVehicleSave }) {
  const km = getCurrentKm(data);

  return (
    <section className="mx-auto max-w-[720px]" aria-label="내 차">
      <div className="overflow-hidden rounded-[32px] border border-line bg-surface shadow-[0_20px_60px_-24px_rgb(60_40_150/0.35)] backdrop-blur-xl">
        <div className="px-5 pt-5 sm:px-7 sm:pt-6">
          <VehicleNameField value={data.vehicle} onSave={onVehicleSave} />
        </div>

        <ModelStage title="메인" showCar size="home" />

        <div className="flex flex-col items-center gap-3 border-t border-line px-5 py-6">
          <p className="text-[0.78rem] font-semibold tracking-[0.08em] text-muted">총 주행거리</p>
          <Odometer km={km} />
          {km === 0 && (
            <Link to="/mileage" className="inline-flex items-center gap-1 text-[0.9rem] font-semibold text-accent">
              첫 주행거리 기록하기
              <Icon name="arrow" className="size-4" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
