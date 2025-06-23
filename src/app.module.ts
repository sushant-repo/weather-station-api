import { Module } from '@nestjs/common';
import { WeatherStationController } from './weather-stations/weather-stations-controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherStation } from './weather-stations/weather-station-entity';
import { WeatherStationService } from './weather-stations/weather-stations-service';
import { Variable } from './variables/variable-entity';
import { VariablesService } from './variables/variables-service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "proa-weather",
      entities: [WeatherStation, Variable],
      synchronize: true
    }),
    TypeOrmModule.forFeature([WeatherStation, Variable])
  ],
  controllers: [WeatherStationController],
  providers: [WeatherStationService, VariablesService],
})
export class AppModule {}
