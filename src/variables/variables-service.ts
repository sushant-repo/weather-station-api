import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Variable } from "./variable-entity";

import { getSeedFilePath } from "src/util/text";
import * as fs from "fs";
import * as csv from "csv-parser";


interface VariableRaw {
    var_id: string,
    id: string,
    name: string,
    unit: string,
    long_name: string
}

@Injectable()
export class VariablesService {
    constructor(
        @InjectRepository(Variable)
        private repo: Repository<Variable>
    ){}

    async seed(): Promise<void>{
        const filePath = getSeedFilePath("variables.csv");

        const variables : Variable[] = [];

        const csvParser = ():Promise<Variable[]> => {
            return new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on("data", (row: VariableRaw) => {
                        variables.push(
                            this.repo.create({
                                long_name: row.long_name,
                                name: row.name,
                                station_id: parseInt(row.id, 10),
                                unit: row.unit,
                                var_id: parseInt(row.var_id, 10)
                            })
                        )
                    })
                    .on("end", () => resolve(variables))
                    .on("error", reject);
            });
        }

        const count = await this.repo.count();

        if(count === 0){
            const parsedVariables = await csvParser();
            await this.repo.save(parsedVariables);

            console.log(`Seeded ${parsedVariables.length} Variables.`);
        }else{
            console.log("Variables already exists. Skipping seeding.")
        }
    }
}