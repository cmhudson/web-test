import {Inventory, Reservation} from '../models'
import {Restaurant} from "../models";
import moment from 'moment'
import {QueryTypes} from "sequelize";

export class ReservationService {
    public async getReservationsForDay(givenDate: string, restId: number) {
        let result = await Reservation.sequelize.query(
            "select count(*), start_time from reservations where restaurant_id = $1 and start_time::date = $2 group by start_time",
            {
                bind: [restId, givenDate],
                type: QueryTypes.SELECT
            }
        )

        let data = []
        result.forEach(rows => {
            let sTime = moment(rows.start_time)
            data[sTime.format('HH:mm')] = rows.count
        })
        return data
    }
}
