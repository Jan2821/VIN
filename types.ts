
export interface VehicleData {
  model: string;
  vin: string;
  equipmentLine: string;
  engine: string;
  specialEquipment: string;
}

export const initialVehicleData: VehicleData = {
  model: '',
  vin: '',
  equipmentLine: '',
  engine: '',
  specialEquipment: '',
};
