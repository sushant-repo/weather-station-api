import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WeatherStation } from "./weather-station-entity";
import { Repository } from "typeorm";

@Injectable()
export class WeatherStationService {
    
    constructor(
        @InjectRepository(WeatherStation)
        private readonly repo: Repository<WeatherStation>
    ){}

    getAllStations() {
        return this.repo.find();
    }

    async onModuleInit(): Promise<void>{
        const count = await this.repo.count();

        if(count === 0){
            const stations = this.repo.create([
                {
                    "id": 1,
                    "ws_name": "Cohuna North",
                    "site": "Cohuna Solar Farm",
                    "portfolio": "Enel Green Power",
                    "state": "VIC",
                    "latitude": 145.449895817713,
                    "longitude": 144.217208,
                },
            ])

            this.repo.save(stations);
            console.log(`Seeded ${stations.length} weather stations`);
        }else{
            console.log("Stations already exists. Skipping seeding");
        }
    }
}