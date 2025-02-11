import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as Communication from '../models/communication';
import ICommunication from '../interfaces/ICommunication';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';

///////////// CommunicationS ///////////////
// validates inputs
const validateCommunication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    object: Joi.string().max(100).presence(required),
    date: Joi.date().allow(null),
    content: Joi.string().max(3000).presence(required),
    idAdmin: Joi.number().presence(required),
    id: Joi.number().optional(),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

// get all Communications
const getAllCommunications = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const communications = await Communication.getAllCommunications(
      formatSortString(sortBy)
    );

    res.setHeader(
      'Content-Range',
      `communications : 0-${communications.length}/${communications.length + 1}`
    );
    return res.status(200).json(communications);
  } catch (err) {
    next(err);
  }
}) as RequestHandler; // Used to avoid eslint error : Promise returned in function argument where a void return was expected

// get one Communication
const getOneCommunication = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idCommunication } = req.params;
    const communication = await Communication.getCommunicationById(
      Number(idCommunication)
    );
    communication ? res.status(200).json(communication) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// checks if Communication exists
const communicationExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Récupèrer l'id Communication de req.params
  const { idCommunication } = req.params;
  // Vérifier si le Communication existe
  try {
    const communicationExists = await Communication.getCommunicationById(
      Number(idCommunication)
    );
    // Si non, => erreur
    if (!communicationExists) {
      next(new ErrorHandler(404, `This communication doesn't exist`));
    }
    // Si oui => next
    else {
      // req.record = CommunicationExists; // because we need deleted record to be sent after a delete in react-Communication
      next();
    }
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// adds a Communication
const addCommunication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const communication = req.body as ICommunication;
    communication.id = await Communication.addCommunication(communication);
    res.status(201).json(communication);
  } catch (err) {
    next(err);
  }
};

const updateCommunication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idCommunication } = req.params;
    const communicationUpdated = await Communication.updateCommunication(
      Number(idCommunication),
      req.body as ICommunication
    );
    if (communicationUpdated) {
      const communication = await Communication.getCommunicationById(
        Number(idCommunication)
      );
      res.status(200).send(communication); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `Communication cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

// delete one Communication
const deleteCommunication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Récupèrer l'id Communication de req.params
    const { idCommunication } = req.params;
    // Vérifier si le Communication existe
    const communication = await Communication.getCommunicationById(
      Number(idCommunication)
    );
    const communicationDeleted = await Communication.deleteCommunication(
      Number(idCommunication)
    );
    if (communicationDeleted) {
      res.status(200).send(communication); // react-Communication needs this response
    } else {
      throw new ErrorHandler(500, `This communication cannot be deleted`);
    }
  } catch (err) {
    next(err);
  }
};

export default {
  getAllCommunications,
  getOneCommunication,
  communicationExists,
  deleteCommunication,
  updateCommunication,
  validateCommunication,
  addCommunication,
};
