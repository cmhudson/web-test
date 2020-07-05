import {
    Column,
    CreatedAt,
    DeletedAt, ForeignKey,
    Model,
    PrimaryKey, Table,
    UpdatedAt
} from 'sequelize-typescript'
import {Restaurant} from "./Restaurant";

@Table({ tableName: 'reservations' })
export class Reservation extends Model<Reservation> {
    @PrimaryKey
    @Column({autoIncrement: true})
    id: number

    @ForeignKey(() => Restaurant)
    @Column
    restaurant_id: number

    @Column
    name: string

    @Column
    email: string

    @Column
    party_size: number

    @Column
    start_time: Date

    @DeletedAt
    deleted_at: string

    @CreatedAt
    created_at: string

    @UpdatedAt
    updated_at: string
}
