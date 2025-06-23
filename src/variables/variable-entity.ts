import { Measurement } from "src/measurements/measurement-entity";
import { WeatherStation } from "src/weather-stations/weather-station-entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Variable {
    @PrimaryColumn()
    var_id: number;

    @Column()
    station_id: number;

    @Column()
    name: string;

    @Column()
    unit: string;

    @Column()
    long_name: string;

    @ManyToOne(() => WeatherStation, (station) => station.variables, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "station_id"})
    weatherStation: WeatherStation

    @OneToMany(() => Measurement, (measurement) => measurement.variable)
    measurements: Measurement[];
}