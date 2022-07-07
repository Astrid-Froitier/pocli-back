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

const addRecipient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const recipient = req.body as IRecipient;
    recipient.id = await Recipient.addRecipient(recipient);
    res.status(201).json(recipient);
  } catch (err) {
    next(err);
  }
};

const recipientExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idRecipient } = req.params;
  try {
    const recipientExists = await Recipient.getRecipientById(
      Number(idRecipient)
    );
    if (!recipientExists) {
      next(new ErrorHandler(404, `This recipient doesn't exisi`));
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

const deleteRecipient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idRecipient } = req.params;
    const recipient = await Recipient.getRecipientById(Number(idRecipient));
    const recipientDeleted = await Recipient.deleteRecipient(
      Number(idRecipient)
    );
    if (recipientDeleted) {
      res.status(200).send(recipient);
    } else {
      throw new ErrorHandler(500, `This recipient cannot be deleted`);
    }
  } catch (err) {
    next(err);
  }
};

export default {
  validateRecipient,
  getAllRecipients,
  getOneRecipient,
  addRecipient,
  recipientExists,
  deleteRecipient,
};
