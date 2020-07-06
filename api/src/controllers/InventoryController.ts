import {Controller, Delete, Get, Middleware, Post} from '@overnightjs/core'
import { Request, Response } from 'express'
import { param, body, validationResult } from 'express-validator'
import { Inventory } from '../models/Inventory'
import {InventoryService} from "../services/InventoryService";

@Controller('inventory')
export class InventoryController {
  @Delete(':inventory_id')
  private async deleteInventory(req: Request, res: Response) {
    const invId = req.params.inventory_id
    let instance = await Inventory.findOne({
      where: {
        inventory_id: invId
      }
    })
    console.log(instance)
    if (instance) {
      instance.destroy()
    }
    return res.status(200).send()
  }

  @Post('')
  @Middleware([
      body('reservation_spaces').isNumeric(),
      body('start_time').matches(/^\d\d:\d\d/),
      body('end_time').matches(/^\d\d:\d\d/),
      body('date').isDate(),
      body('restaurant_id').isNumeric()
  ])
  private async make(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

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

      const query = await Inventory.findAll({
          where: {
              restaurant_id: 3,
              block_date: req.params.date
          },
          order: ['start_time']
      })
      return res.status(200).send(await query);
  }

  @Get(':date/availability')
  @Middleware([param('date').isDate()])
    private async getAvailability(req: Request, res: Response) {
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
