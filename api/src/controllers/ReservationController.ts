import {Controller, Get, Middleware, Post} from '@overnightjs/core'
import { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'

@Controller('reservation')
export class InventoryController {
  @Post('')
  @Middleware([
      body('name').isLength({min: 3}),
      body('email').isEmail(),
      body('start_time').matches(/^\d\d:\d\d/),
      body('date').isDate()
  ])
  private async get(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let reservation = {
        name: req.body.name,
        email: req.body.email,
        start_time: req.body.start_time,
        date: req.body.date
    }

    return res.send(req.body).sendStatus(200);
  }
}
