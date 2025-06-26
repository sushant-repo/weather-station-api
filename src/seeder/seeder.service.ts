import { Injectable } from '@nestjs/common';
import { MeasurementsService } from 'src/measurements/measurements-service';
import { VariablesService } from 'src/variables/variables-service';
import { WeatherStationService } from 'src/weather-stations/weather-stations-service';

@Injectable()
export class SeederService {
  constructor(
    private weatherStationService: WeatherStationService,
    private variableService: VariablesService,
    private measurementService: MeasurementsService,
  ) {}

  async seed() {
    await this.weatherStationService.seed();  
    await this.variableService.seed();        
    await this.measurementService.seed();     
  }
}
