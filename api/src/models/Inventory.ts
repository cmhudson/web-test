import {
    Column,
    CreatedAt,
    DeletedAt, ForeignKey,
    Model,
    PrimaryKey, Table,
    UpdatedAt
} from 'sequelize-typescript'
import {Restaurant} from './Restaurant'

@Table({ tableName: 'inventory' })
export class Inventory extends Model<Inventory> {
    @PrimaryKey
    @Column({autoIncrement: true})
    inventory_id: number

    @Column
    block_date: Date

    @Column
    start_time: string

    @Column
    end_time: string

    @Column
    reservation_spaces: number

    @ForeignKey(() => Restaurant)
    @Column
    restaurant_id: number


    @DeletedAt
    deleted_at: string

    @CreatedAt
    created_at: string

    @UpdatedAt
    updated_at: string
}
