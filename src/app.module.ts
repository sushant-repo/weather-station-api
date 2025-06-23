import { Module } from '@nestjs/common';
import { WeatherStationController } from './weather-stations/weather-stations-controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherStation } from './weather-stations/weather-station-entity';
import { WeatherStationService } from './weather-stations/weather-stations-service';
import { Variable } from './variables/variable-entity';
import { VariablesService } from './variables/variables-service';
import { Measurement } from './measurements/measurement-entity';
import { MeasurementsService } from './measurements/measurements-service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "proa-weather",
      entities: [WeatherStation, Variable, Measurement],
      synchronize: true
    }),
    TypeOrmModule.forFeature([WeatherStation, Variable, Measurement]),
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  controllers: [WeatherStationController],
  providers: [WeatherStationService, VariablesService, MeasurementsService],
})
export class AppModule {}
