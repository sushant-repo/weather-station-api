import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Measurement } from "./measurement-entity";
import { Repository } from "typeorm";
import * as path from "path";
import * as fs from "fs";
import * as csv from "csv-parser";
import { Variable } from "src/variables/variable-entity";
import { getSeedDirectory } from "src/util/text";

interface MeasurementRaw {
    [key: string]: string;
}

@Injectable()
export class MeasurementsService {
    constructor(
        @InjectRepository(Measurement)
        private readonly repo: Repository<Measurement>,

        @InjectRepository(Variable)
        private readonly variableRepo: Repository<Variable>
    ) {}

    async seed(): Promise<void> {
        const seedDir = getSeedDirectory();
        const files = fs.readdirSync(seedDir);
        const measurementFiles = files.filter((file) =>
            /^data_\d+\.csv$/.test(file)
        );

        if(measurementFiles.length === 0){
            throw new Error("Missing measurement files.")
        }

        const count = await this.repo.count();
        if (count !== 0) {
            console.log("Measurements already exists. Skipping seeding.");
            return;
        }

        let totalSeeded = 0;

        for (const file of measurementFiles.sort()) {
            const station_id = parseInt(file.match(/\d+/)?.[0] || "", 10);
            const filePath = path.join(seedDir, file);

            const variables = await this.variableRepo.find({
                where: { station_id },
            });

            const variableMap = new Map<string, number>();
            for (const variable of variables) {
                variableMap.set(variable.name, variable.var_id);
            }

            const measurements: Measurement[] = [];
            await new Promise<void>((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on("data", (row: MeasurementRaw) => {
                        const timestamp = row.timestamp?.trim();
                        if (!timestamp) return;

                        for (const [col, val] of Object.entries(row)) {
                            if (col === "timestamp") continue;

                            const var_id = variableMap.get(col);
                            if (!var_id) continue;

                            const value = parseFloat(val);
                            if (isNaN(value)) continue;

                            measurements.push(
                                this.repo.create({
                                    value,
                                    timestamp,
                                    var_id,
                                    station_id,
                                })
                            );
                        }
                    })
                    .on("end", () => resolve())
                    .on("error", reject);
            });

            await this.repo.save(measurements);
            totalSeeded += measurements.length;

            console.log(`Seeded ${measurements.length} data from ${file}.`);
        }

        console.log(`Total measurements seeded: ${totalSeeded}`);
    }
}
