import ModelStage from '../components/ModelStage.jsx';
import Odometer from '../components/Odometer.jsx';
import VehicleNameField from '../features/home/VehicleNameField.jsx';
import { getCurrentKm } from '../utils/mileage.js';

export default function Home({ data, onVehicleSave }) {
  return (
    <section className="mx-auto flex max-w-[820px] flex-col gap-4" aria-label="내 차">
      <VehicleNameField value={data.vehicle} onSave={onVehicleSave} />
      <ModelStage title="메인" showCar size="home" />
      <Odometer km={getCurrentKm(data)} />
    </section>
  );
}
