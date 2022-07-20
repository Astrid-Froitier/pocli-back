import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as PaymentRecord from '../models/paymentRecord';
import IPaymentRecord from '../interfaces/IPaymentRecord';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';

const validatePaymentRecord = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    checkNumber: Joi.string().max(50).allow(null),
    dateStart: Joi.date().presence(required),
    dateEnd: Joi.date().presence(required),
    amount: Joi.number().max(1500).presence(required),
    idPaymentMethod: Joi.number().presence(required),
    idFamily: Joi.number().presence(required),
    idFamilyMember: Joi.number().allow(null),
    idActivity: Joi.number().allow(null),
    id: Joi.number().optional(), // pour react-admin
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

const getAllPaymentRecords = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const paymentRecords = await PaymentRecord.getAllPaymentRecord(
      formatSortString(sortBy)
    );

    res.setHeader(
      'Content-Range',
      `users : 0-${paymentRecords.length}/${paymentRecords.length + 1}`
    );
    return res.status(200).json(paymentRecords);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

const getOnePaymentRecord = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idPaymentRecord } = req.params;
    const paymentRecords = await PaymentRecord.getPaymentRecordById(
      Number(idPaymentRecord)
    );
    paymentRecords ? res.status(200).json(paymentRecords) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

const getAllPaymentRecordsByIdFamily = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idFamily } = req.params;
    const paymentRecordsByIdFamily = await PaymentRecord.getAllPaymentRecordsByIdFamily(
      Number(idFamily)
    );
    paymentRecordsByIdFamily ? res.status(200).json(paymentRecordsByIdFamily) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

const addPaymentRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paymentRecord = req.body as IPaymentRecord;
    paymentRecord.id = await PaymentRecord.addPaymentRecord(paymentRecord);
    res.status(201).json(paymentRecord);
  } catch (err) {
    next(err);
  }
};

const paymentRecordExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Récupèrer l'id paymentRecord de req.params
  const { idPaymentRecord } = req.params;
  // Vérifier si le paymentRecord existe
  try {
    const paymentRecordExists = await PaymentRecord.getPaymentRecordById(
      Number(idPaymentRecord)
    );
    // Si non, => erreur
    if (!paymentRecordExists) {
      next(new ErrorHandler(404, `This paymentRecord doesn't exist`));
    }
    // Si oui => next
    else {
      // req.record = paymentRecordExists; // because we need deleted record to be sent after a delete in react-admin
      next();
    }
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

const updatePaymentRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idPaymentRecord } = req.params;
    const paymentRecordUpdated = await PaymentRecord.updatePaymentRecord(
      Number(idPaymentRecord),
      req.body as IPaymentRecord
    );
    if (paymentRecordUpdated) {
      const paymentRecord = await PaymentRecord.getPaymentRecordById(
        Number(idPaymentRecord)
      );
      res.status(200).send(paymentRecord); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `PaymentRecord cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

const deletePaymentRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Récupèrer l'id user de req.params
    const { idPaymentRecord } = req.params;
    // Vérifier si le user existe
    const paymentRecord = await PaymentRecord.getPaymentRecordById(
      Number(idPaymentRecord)
    );
    const paymentRecordDeleted = await PaymentRecord.deletePaymentRecord(
      Number(idPaymentRecord)
    );
    if (paymentRecordDeleted) {
      res.status(200).send(paymentRecord); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `This paymentRecord cannot be deleted`);
    }
  } catch (err) {
    next(err);
  }
};

export default {
  getAllPaymentRecordsByIdFamily,
  validatePaymentRecord,
  paymentRecordExists,
  getAllPaymentRecords,
  getOnePaymentRecord,
  addPaymentRecord,
  updatePaymentRecord,
  deletePaymentRecord,
};
