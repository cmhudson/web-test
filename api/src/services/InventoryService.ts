import {Inventory} from '../models/Inventory'
import {Restaurant} from "../models";
import moment from 'moment'

export class InventoryService {
    public async getInventoryForDay(givenDate: string, restId: number) {
        // query inventory table
        let model = new Inventory()
        const query = await Inventory.findAll({
            where: {
                restaurant_id: restId,
                block_date: givenDate
            }
        })
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


        query.every( row => {
            let rowMomentStart = moment(row.block_date).hour(row.start_time.split(':')[0]).minute(row.start_time.split(':')[1])
            let rowMomentEnd = moment(row.block_date).hour(row.end_time.split(':')[0]).minute(row.end_time.split(':')[1])
            console.log("inside query loop", rowMomentStart, rowMomentEnd)
            data.forEach(element => {
                if (rowMomentStart.format('HH:mm') <= element.start_time && rowMomentEnd.format('HH:mm') > element.start_time) {
                    console.log("we foudn a spot")
                }
            })
        })

        return data
    }
}
