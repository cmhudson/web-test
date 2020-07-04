import {Controller, Get, Middleware, Post} from '@overnightjs/core'
import { Request, Response } from 'express'
import { param, body, validationResult } from 'express-validator'
import { Inventory } from '../models/Inventory'
import {InventoryService} from "../services/InventoryService";

@Controller('inventory')
export class InventoryController {
  @Post('')
  @Middleware([
      body('reservation_spaces').isNumeric(),
      body('start_time').matches(/^\d\d:\d\d/),
      body('end_time').matches(/^\d\d:\d\d/),
      body('date').isDate(),
      body('restaurant_id').isNumeric()
  ])
  private async get(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    // @todo: middleware to handle auth/restaurant identification.
    /*let restaurantId = req.header('X-restaurant-id');
    if (! restaurantId) {
        return res.status(422).json({errors: ["missing restaurant ID header"]})
    }*/

    let inv = {
        end_time: req.body.end_time,
        start_time: req.body.start_time,
        block_date: req.body.date,
        reservation_spaces: req.body.reservation_spaces,
        restaurant_id: req.body.restaurant_id
    }
    try {
        const inventory = Inventory.build(inv)
        inventory.save()
    } catch (errors) {
        return res.status(500).json({ errors: errors.array() });
    }

    return res.send(inv).sendStatus(200);
  }

  @Get(':date')
  @Middleware([param('date').isDate()])
  private async getByDate(req: Request, res: Response) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
      }

      // get inventory for day
      const invClass = new InventoryService()
      let forDay = invClass.getInventoryForDay(req.params['date'], 3)
      //console.log("From controller: ", await forDay)
      return res.status(200).send(await forDay);
  }
}
