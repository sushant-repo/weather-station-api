import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class WeatherStation {
    @PrimaryColumn()
    id: number;

    @Column()
    ws_name: string;

    @Column()
    site: string;

    @Column()
    state: string;

    @Column()
    portfolio: string;

    @Column("float")
    longitude: number;

    @Column("float")
    latitude: number;
}