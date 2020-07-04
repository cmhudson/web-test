import {Inventory} from '../models/Inventory'
import {Restaurant} from "../models";
import moment from 'moment'

export class InventoryService {
    public async getInventoryForDay(givenDate: string, restId: number) {
        // query inventory table
        let model = new Inventory()

        // start at restaurant opening time
        let restaurant = await Restaurant.findOne({where: { id: restId}})
        let openTime = moment(givenDate)
        let closingTime = moment(givenDate)

        let timeParts = restaurant.open_time.split(':')
        closingTime.hour(restaurant.close_time.split(':')[0]).minute(0)

        openTime.hour(timeParts[0]).minute(0)

        let data = []

        while (openTime < closingTime) {
           data.push({
                start_time: openTime.format('HH:mm'),
                available_reservations: 0
            })
            openTime.add(15, 'minutes')
        }

        const query = await Inventory.findAll({
            where: {
                restaurant_id: restId,
                block_date: givenDate
            }
        })
        let blockStart = moment(givenDate)
        let blockEnd = moment(givenDate)
        let incrementStart = moment(givenDate)

        query.forEach( row => {
            blockStart.hour(row.start_time.split(':')[0]).minute(row.start_time.split(':')[1])
            blockEnd.hour(row.end_time.split(':')[0]).minute(row.end_time.split(':')[1])


            let index = 0
            data.forEach(element => {
                incrementStart.hour(element.start_time.split(':')[0]).minute(element.start_time.split(':')[1])
                if (blockStart <= incrementStart && blockEnd > incrementStart) {
                    data[index].available_reservations = row.reservation_spaces
                }
                index++
            })
        })

        return data
    }
}
