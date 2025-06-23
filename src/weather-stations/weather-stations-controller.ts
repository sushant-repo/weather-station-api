import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
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

    @Get(":id")
    async getById(@Param("id", ParseIntPipe) id: number){
        return this.service.getStationById(id);
    }
}