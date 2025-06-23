import { MeasurementResponseDto } from "src/measurements/measurement-response-dto";

export class WeatherStationResponseDto {
  id: number;
  ws_name: string;
  site: string;
  portfolio: string;
  state: string;
  latitude: number;
  longitude: number;

  measurements: MeasurementResponseDto[];
}