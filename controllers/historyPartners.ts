import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as HistoryPartner from '../models/historyPartner';
import IHistoryPartner from '../interfaces/IHistoryPartner';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';

///////////// HistoryPARTNERS ///////////////
// validates inputs
const validateHistoryPartner = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    name: Joi.string().max(100).presence(required),
    logo: Joi.string().max(100).presence(required),
    url: Joi.string().max(100).presence(required),
    description: Joi.string().max(250).presence(required),
    siretNumber: Joi.number().max(5).presence(required),
    idHistoryPartnerType: Joi.number().max(10).presence(required),
    idUserPost: Joi.number().max(10).presence(required),
    idPartner: Joi.number().max(10).presence(required),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

const nameIsFree = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    // get name from req.body
    const { name } = req.body as IHistoryPartner;
    // Checks if name already belongs to a registered historyPartner
    const historyPartnerExists = await HistoryPartner.getHistoryPartnerByName(
      name
    );
    // If email isn't free = Send an error
    if (historyPartnerExists) {
      next(new ErrorHandler(400, `This historyPartner already exists`));
    } else {
      // if email is free, next
      next();
    }
  } catch (err) {
    next(err);
  }
};

const siretNumberIsFree = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // get siretNumber from req.body
    const { siretNumber } = req.body as IHistoryPartner;
    // Checks if siretNumber already belongs to a registered historyPartner
    const historyPartnerExists =
      await HistoryPartner.getHistoryPartnerBySiretNumber(siretNumber);
    // If siretNumber isn't free = Send an error
    if (historyPartnerExists) {
      next(new ErrorHandler(400, `This historyPartner already exists`));
    } else {
      // if siretNumber is free, next
      next();
    }
  } catch (err) {
    next(err);
  }
};

// get all historyPartners
const getAllHistoryPartners = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const historyPartners = await HistoryPartner.getAllHistoryPartners(
      formatSortString(sortBy)
    );

    res.setHeader(
      'Content-Range',
      `historyPartners : 0-${historyPartners.length}/${
        historyPartners.length + 1
      }`
    );
    return res.status(200).json(historyPartners);
  } catch (err) {
    next(err);
  }
}) as RequestHandler; // Used to avoid eslint error : Promise returned in function argument where a void return was expected

// get one historyPartner
const getOneHistoryPartner = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idHistoryPartner } = req.params;
    const historyPartner = await HistoryPartner.getHistoryPartnerById(
      Number(idHistoryPartner)
    );
    historyPartner ? res.status(200).json(historyPartner) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// checks if historyPartner exists
const historyPartnerExists = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Récupèrer l'id historyPartner de req.params
  const { idHistoryPartner } = req.params;
  // Vérifier si le historyPartner existe
  try {
    const historyPartnerExists = await HistoryPartner.getHistoryPartnerById(
      Number(idHistoryPartner)
    );
    // Si non, => erreur
    if (!historyPartnerExists) {
      next(new ErrorHandler(404, `This historyPartner doesn't exist`));
    }
    // Si oui => next
    else {
      req.record = historyPartnerExists; // because we need deleted record to be sent after a delete in react-admin
      next();
    }
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// adds a historyPartner
const addHistoryPartner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const historyPartner = req.body as IHistoryPartner;
    historyPartner.id = await HistoryPartner.addHistoryPartner(historyPartner);
    res.status(201).json(historyPartner);
  } catch (err) {
    next(err);
  }
};

// updates a historyPartner
const updateHistoryPartner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idHistoryPartner } = req.params;
    const historyPartnerUpdated = await HistoryPartner.updateHistoryPartner(
      Number(idHistoryPartner),
      req.body as IHistoryPartner
    );
    if (historyPartnerUpdated) {
      const historyPartner = await HistoryPartner.getHistoryPartnerById(
        Number(idHistoryPartner)
      );
      res.status(200).send(historyPartner); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `historyPartner cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

// delete one historyPartner
const deleteHistoryPartner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Récupèrer l'id historyPartner de req.params
    const { idHistoryPartner } = req.params;
    // Vérifier si le historyPartner existe
    const historyPartner = await HistoryPartner.getHistoryPartnerById(
      Number(idHistoryPartner)
    );
    const historyPartnerDeleted = await HistoryPartner.deleteHistoryPartner(
      Number(idHistoryPartner)
    );
    if (historyPartnerDeleted) {
      res.status(200).send(historyPartner); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `This historyPartner cannot be deleted`);
    }
  } catch (err) {
    next(err);
  }
};
export default {
  getAllHistoryPartners,
  getOneHistoryPartner,
  historyPartnerExists,
  nameIsFree,
  deleteHistoryPartner,
  validateHistoryPartner,
  addHistoryPartner,
  updateHistoryPartner,
  siretNumberIsFree,
};
