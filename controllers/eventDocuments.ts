import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as EventDocument from '../models/eventDocument';
import IEventDocument from '../interfaces/IEventDocument';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';

// validates inputs
const validateEventDocument = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    idDocument: Joi.number().presence(required),
    idEvent: Joi.number().presence(required),
    id: Joi.number().optional(), // pour react-admin
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

// get all EventDocuments
const getAllEventDocuments = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const eventDocuments = await EventDocument.getAllEventDocuments(
      formatSortString(sortBy)
    );

    res.setHeader(
      'Content-Range',
      `eventDocuments : 0-${eventDocuments.length}/${eventDocuments.length + 1}`
    );
    return res.status(200).json(eventDocuments);
  } catch (err) {
    next(err);
  }
}) as RequestHandler; // Used to avoid eslint error : Promise returned in function argument where a void return was expected

// get one EventDocument
const getOneEventDocument = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idEventDocument } = req.params;
    const eventDocument = await EventDocument.getEventDocumentById(
      Number(idEventDocument)
    );
    eventDocument ? res.status(200).json(eventDocument) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// checks if an eventDocument exists before update or delete
const eventDocumentExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idEventDocument } = req.params;

  const eventDocumentExists: IEventDocument =
    await EventDocument.getEventDocumentById(Number(idEventDocument));
  if (!eventDocumentExists) {
    next(new ErrorHandler(409, `This eventDocument does not exist`));
  } else {
    // req.record = eventDocumentExists; // because we need deleted record to be sent after a delete in react-admin
    next();
  }
};

// adds a eventDocument

const addEventDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const eventDocumentId = await EventDocument.addEventDocument(
      req.body as IEventDocument
    );
    if (eventDocumentId) {
      res.status(201).json({ id: eventDocumentId, ...req.body });
    } else {
      throw new ErrorHandler(500, `eventDocument cannot be created`);
    }
  } catch (err) {
    next(err);
  }
};

// updates a eventDocument

const updateEventDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idEventDocument } = req.params;
    const eventDocumentUpdated = await EventDocument.updateEventDocument(
      Number(idEventDocument),
      req.body as IEventDocument
    );
    if (eventDocumentUpdated) {
      const eventDocument = await EventDocument.getEventDocumentById(
        Number(idEventDocument)
      );
      res.status(200).send(eventDocument); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `EventDocument cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

// delete one eventDocument
const deleteEventDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idEventDocument } = req.params;
    const eventDocumentDeleted = await EventDocument.deleteEventDocument(
      Number(idEventDocument)
    );
    if (eventDocumentDeleted) {
      res.status(200).send(req.record); // react-admin needs this response
    } else {
      throw new ErrorHandler(409, `EventDocument not found`);
    }
  } catch (err) {
    next(err);
  }
};

export default {
  validateEventDocument,
  getAllEventDocuments,
  getOneEventDocument,
  eventDocumentExists,
  addEventDocument,
  updateEventDocument,
  deleteEventDocument,
};
