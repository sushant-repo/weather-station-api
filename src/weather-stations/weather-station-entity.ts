import { Variable } from "src/variables/variable-entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from "typeorm";

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

    @OneToMany(() => Variable, (variable) => variable.weatherStation)
    variables: Variable[];
}