import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as Recipient from '../models/recipient';
import IRecipient from '../interfaces/IRecipient';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';

const validateRecipient = (req: Request, res: Response, next: NextFunction) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    name: Joi.string().max(100).presence(required),
    id: Joi.number().optional(), // pour react-admin
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

const getAllRecipients = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const recipients = await Recipient.getAllRecipient(
      formatSortString(sortBy)
    );

    res.setHeader(
      'Content-Range',
      `users : 0-${recipients.length}/${recipients.length + 1}`
    );
    return res.status(200).json(recipients);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

const getOneRecipient = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idRecipient } = req.params;
    const recipient = await Recipient.getRecipientById(Number(idRecipient));
    recipient ? res.status(200).json(recipient) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

export default {
  validateRecipient,
  getAllRecipients,
  getOneRecipient,
};
