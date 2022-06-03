import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as HistoryNew from '../models/historyNew';
import IHistoryNew from '../interfaces/IHistoryNew';
import { ErrorHandler } from '../helpers/errors';
import { formatSortString } from '../helpers/functions';
import Joi from 'joi';

///////////// HISTORYNEWS ///////////////
// validates inputs
const validateHistoryNew = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    date: Joi.number().max(8).presence(required),
    streetNumber: Joi.number().max(5).presence(required),
    address: Joi.string().min(0).max(100).presence(required),
    zipCode: Joi.number().max(10).presence(required),
    city: Joi.string().max(100).presence(required),
    hours: Joi.number().max(5).presence(required),
    numberOfParticipants: Joi.number().max(3).presence(required),
    idUserPost: Joi.number().max(5).presence(required),
    idUserAdmin: Joi.number().max(5).presence(required),
    idNew: Joi.number().max(5).presence(required),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

// get all historyNews
const getAllHistoryNews = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortBy: string = req.query.sort as string;
    const historyNews = await HistoryNew.getAllHistoryNews(
      formatSortString(sortBy)
    );

    res.setHeader(
      'Content-Range',
      `historyNew : 0-${historyNews.length}/${historyNews.length + 1}`
    );
    return res.status(200).json(historyNews);
  } catch (err) {
    next(err);
  }
}) as RequestHandler; // Used to avoid eslint error : Promise returned in function argument where a void return was expected

// get one Historynew
const getOneHistoryNew = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idHistoryNew } = req.params;
    const historyNew = await HistoryNew.getHistoryNewById(Number(idHistoryNew));
    historyNew ? res.status(200).json(historyNew) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

// adds a Historynew
const addHistoryNew = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const historyNew = req.body as IHistoryNew;
    historyNew.id = await HistoryNew.addHistoryNew(historyNew);
    res.status(201).json(historyNew);
  } catch (err) {
    next(err);
  }
};

// updates a Historynew
const updateHistoryNew = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idHistoryNew } = req.params;
    const historyNewUpdated = await HistoryNew.updateHistoryNew(
      Number(idHistoryNew),
      req.body as IHistoryNew
    );
    if (historyNewUpdated) {
      const historyNew = await HistoryNew.getHistoryNewById(
        Number(idHistoryNew)
      );
      res.status(200).send(historyNew); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `HistoryNew cannot be updated`);
    }
  } catch (err) {
    next(err);
  }
};

// delete one historyNew
const deleteHistoryNew = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Récupèrer l'id historyNew de req.params
    const { idHistoryNew } = req.params;
    // Vérifier si le historyNew existe
    const delHistoryNew = await HistoryNew.getHistoryNewById(
      Number(idHistoryNew)
    );
    const historyNewDeleted = await HistoryNew.deleteHistoryNew(
      Number(idHistoryNew)
    );
    if (historyNewDeleted) {
      res.status(200).send(delHistoryNew); // react-admin needs this response
    } else {
      throw new ErrorHandler(500, `This Historynew cannot be deleted`);
    }
  } catch (err) {
    next(err);
  }
};
export default {
  validateHistoryNew,
  getAllHistoryNews,
  getOneHistoryNew,
  addHistoryNew,
  updateHistoryNew,
  deleteHistoryNew,
};
