import { Variable } from "src/variables/variable-entity";
import { WeatherStation } from "src/weather-stations/weather-station-entity";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Measurement {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    station_id: number;

    @Column()
    var_id: number;

    @Column("float")
    value: number;

    @Column()
    timestamp: string;

    @ManyToOne(() => Variable, { onDelete: "CASCADE" })
    @JoinColumn({ name: "var_id" })
    variable: Variable;
}
