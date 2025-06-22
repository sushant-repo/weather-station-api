import { Module } from '@nestjs/common';
import { WeatherStationController } from './weather-stations/weather-stations-controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherStation } from './weather-stations/weather-station-entity';
import { WeatherStationService } from './weather-stations/weather-stations-service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "proa-weather",
      entities: [WeatherStation],
      synchronize: true
    }),
    TypeOrmModule.forFeature([WeatherStation])
  ],
  controllers: [WeatherStationController],
  providers: [WeatherStationService],
})
export class AppModule {}
