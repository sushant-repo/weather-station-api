import { Controller, Get } from "@nestjs/common";
import { WeatherStationService } from "./weather-stations-service";

@Controller("stations")
export class WeatherStationController{
    constructor(
        private readonly service: WeatherStationService
    ){}

    @Get()
    async getAll(){
        return this.service.getAllStations();
    }
}