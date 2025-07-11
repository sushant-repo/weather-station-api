import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WeatherStation } from "./weather-station-entity";
import { getSeedFilePath } from "src/util/text";
import * as fs from "fs";
import * as csv from "csv-parser";
import { MeasurementResponseDto } from "src/measurements/measurement-response-dto";
import { WeatherStationResponseDto } from "./weather-station-response-dto";

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

    async getStationById(id: number) {
        var station = await this.repo.findOne({
            where: {id},
            relations: ['variables', 'variables.measurements']
        });

        if(station == null){
            throw new Error(`Station with id: ${id} was not found.`);
        }

        return this.transformToStationResponseDto(station)
    }

    private  transformToStationResponseDto(station: WeatherStation): WeatherStationResponseDto {
        const measurements: MeasurementResponseDto[] = station.variables
            .flatMap((v) =>
            v.measurements.map((m) => ({
                id: m.id,
                station_id: m.station_id,
                var_id: m.var_id,
                value: m.value,
                timestamp: m.timestamp,
                variableName: v.long_name,
                unit: v.unit,
            }))
            )
            .sort(
            (a, b) =>
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime() // latest first
            );

        return {
            id: station.id,
            ws_name: station.ws_name,
            site: station.site,
            portfolio: station.portfolio,
            state: station.state,
            latitude: station.latitude,
            longitude: station.longitude,
            measurements,
        };
    }

    
    async seed(): Promise<void>{
        const filePath = getSeedFilePath("weather_stations.csv");

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