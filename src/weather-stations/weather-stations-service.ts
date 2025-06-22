import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WeatherStation } from "./weather-station-entity";
import * as path from "path";
import * as fs from "fs";
import * as csv from "csv-parser";

interface WeatherStationRaw {
    id: string,
    ws_name: string,
    site: string,
    portfolio: string,
    state: string,
    latitude: string,
    longitude: string,
}

@Injectable()
export class WeatherStationService {
    constructor(
        @InjectRepository(WeatherStation)
        private repo: Repository<WeatherStation>
    ){}

    getAllStations() {
        return this.repo.find();
    }

    async onModuleInit(): Promise<void>{
        const filePath = path.resolve(
            process.cwd(),
            "src",
            "seeds",
            "weather_stations.csv"
        );

        const stations: WeatherStation[] = [];

        const fileParser = ():Promise<WeatherStation[]> => {
            return new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                .pipe(csv())
                .on("data", (row: WeatherStationRaw) => {
                      const station =  this.repo.create({
                            id: parseInt(row.id, 10),
                            latitude: parseFloat(row.latitude),
                            longitude: parseFloat(row.longitude),
                            portfolio: row.portfolio,
                            site: row.site,
                            state: row.state,
                            ws_name: row.ws_name
                        })
                    ;
                    stations.push(station)
                })
                .on("end", () => resolve(stations))
                .on("error", reject);
            });
        }

        const count = await this.repo.count();

        if(count === 0){
            const parsedStations = await fileParser();
            await this.repo.save(parsedStations);
            console.log(`Seeded ${parsedStations.length} Weather Stations.`)
        }else{
            console.info("Weather stations already exists. Skipping seeding");
        }
    }
}