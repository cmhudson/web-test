import {Controller, Get, Middleware, Post} from '@overnightjs/core'
import { Request, Response } from 'express'
import { param, body, validationResult } from 'express-validator'
import moment from 'moment'
import { Reservation } from "../models";
import { InventoryService } from "../services/InventoryService";

@Controller('reservations')
export class ReservationController {

  @Get(':date')
  @Middleware([param('date').isDate()])
  private async getByDate(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const query = await Reservation.findAll({
      where: {
        restaurant_id: 3,
        start_time: req.params.date
      },
      order: ['start_time']
    })
    return res.status(200).send(await query);
  }

  @Post('')
  @Middleware([
      body('name').isLength({min: 1}),
      body('email').isEmail(),
      body('party_size').isNumeric(),
      body('start_time').matches(/^\d\d:\d\d/),
      body('date').isDate(),
      body('restaurant_id').isNumeric()
  ])
  private async make(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // validate against inventory
    let reservation = {
        name: req.body.name,
        email: req.body.email,
        party_size: req.body.party_size,
        start_time: moment(req.body.date).hour(req.body.start_time.split(':')[0]).minute(req.body.start_time.split(':')[1]),
        restaurant_id: req.body.restaurant_id
    }

    // check if inventory exists
      let svc = new InventoryService()
      let validateTime = await svc.hasInventory(
          reservation.start_time.format("YYYY-MM-DD HH:mm"),
          req.body.restaurant_id
      )
      if (!validateTime) {
          return res.status(422).json({errors: ['reservation_unavailable']})
      }
      try {
          const reserved = Reservation.build(reservation)
          await reserved.save()
          return res.send(reserved).sendStatus(200);
      } catch (errors) {
          return res.status(500).json({ errors: errors.array() });
      }

  }
}
