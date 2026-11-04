import ModelStage from '../components/ModelStage.jsx';
import Odometer from '../components/Odometer.jsx';
import VehicleNameField from '../features/home/VehicleNameField.jsx';
import { getCurrentKm } from '../utils/mileage.js';

export default function Home({ data, onVehicleSave }) {
  return (
    <section className="home" aria-label="내 차">
      <VehicleNameField value={data.vehicle} onSave={onVehicleSave} />
      <ModelStage title="메인" showCar className="stage-home" />
      <Odometer km={getCurrentKm(data)} />
    </section>
  );
}
