import {Controller, Get, Middleware, Post} from '@overnightjs/core'
import { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import moment from 'moment'
import {Inventory, Reservation} from "../models";

@Controller('reservations')
export class ReservationController {
  @Post('')
  @Middleware([
      body('name').isLength({min: 3}),
      body('email').isEmail(),
      body('party_size').isNumeric(),
      body('start_time').matches(/^\d\d:\d\d/),
      body('date').isDate(),
      body('restaurant_id').isNumeric()
  ])
  private async post(req: Request, res: Response) {
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
      try {
          const reserved = Reservation.build(reservation)
          reserved.save()
      } catch (errors) {
          return res.status(500).json({ errors: errors.array() });
      }

    return res.send(req.body).sendStatus(200);
  }
}
