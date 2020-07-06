import {Inventory} from '../models'
import {Restaurant} from "../models";
import moment from 'moment'
import {QueryTypes} from "sequelize";
import {ReservationService} from "./ReservationService";

export class InventoryService {
    public async getInventoryForDay(givenDate: string, restId: number) {

        const resSvc = new ReservationService()

        // start at restaurant opening time
        let restaurant = await Restaurant.findOne({where: { id: restId}})
        let openTime = moment(givenDate)
        let closingTime = moment(givenDate)

        let timeParts = restaurant.open_time.split(':')
        // set opening and closing times based on restaurant record
        closingTime.hour(restaurant.close_time.split(':')[0]).minute(0)
        openTime.hour(timeParts[0]).minute(0)

        let data = [] // array of times that will be retunred
        
        let reservations = await resSvc.getReservationsForDay(givenDate, restId)

        // query for inventory blocks
        const query = await Inventory.findAll({
            where: {
                restaurant_id: restId,
                block_date: givenDate
            }
        })
        
        let blockStart = moment(givenDate) // moment object instantiated here, modified in loop
        let blockEnd = moment(givenDate)

        // build array of 15 minute increments and populate with inventory data
        // and reservation data
        while (openTime < closingTime) {
            let spaces = 0
            query.forEach( row => {
                // modify the moment instances so they can be used for comparison
                blockStart.hour(row.start_time.split(':')[0]).minute(row.start_time.split(':')[1])
                blockEnd.hour(row.end_time.split(':')[0]).minute(row.end_time.split(':')[1])

                if (blockStart <= openTime && blockEnd >= openTime) {
                    // if there is an inventory block that contains this increment
                    spaces = row.reservation_spaces
                }
            })
            // check the reservation array if there's a row that matches
            if (reservations[openTime.format('HH:mm')]) {
                spaces = spaces - reservations[openTime.format('HH:mm')]
            }

            let dataRow ={
                start_time: openTime.format('HH:mm'),
                available_reservations: spaces
            }
            data.push(dataRow)
            openTime.add(15, 'minutes')
        }
        return data
    }

    public async hasInventory(resTime: string, restId: number) {
        let startTimestamp = moment(resTime)
        let resDateString = startTimestamp.format('YYYY-MM-DD')
        let resTimeString = startTimestamp.format('HH:mm')
        let restimeStampString = startTimestamp.format('YYYY-MM-DD HH:mm')
        console.log(resDateString, resTimeString)
        let query = await Inventory.sequelize.query(
            "select coalesce((select reservation_spaces from inventory " +
            " where restaurant_id = $1 " +
            "  and block_date = $2 " +
            " and start_time <= $3 and end_time >= $3 and deleted_at is null LIMIT 1 ), 0) - ( " +
            " select count(*) from reservations where restaurant_id = $1" +
            " and start_time = $4" +
            ") as available",
            {
                bind: [restId,resDateString,resTimeString, restimeStampString],
                type: QueryTypes.SELECT
            }
        )
        return query[0].available > 0
    }


}
